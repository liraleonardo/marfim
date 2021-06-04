package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.AuthDTO;
import org.ipdec.marfim.api.dto.AuthOrganizationDTO;
import org.ipdec.marfim.api.dto.AuthOrganizationRoleDTO;
import org.ipdec.marfim.api.dto.AuthUserDTO;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.model.Role;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.security.auth.marfim.MarfimJWTToken;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class AuthenticationUtilService {

    private final MarfimJWTToken marfimJWTToken;

    private final OrganizationService organizationService;

    private String getToken(User user) {
        return marfimJWTToken.generateToken(user);
    }


    public AuthDTO createAuthDTO(User user) {
        AuthUserDTO userDTO = new AuthUserDTO(user);
        String token = getToken(user);
        List<AuthOrganizationDTO> organizationsDTO;
        if(user.isSuper()){
            organizationsDTO = getAllOrganizations();
        }else{
            organizationsDTO = getRolesGroupedByOrganizations(user);
        }
        return new AuthDTO(token,userDTO,organizationsDTO);
    }

    // will return all roles grouped by organization
    private List<AuthOrganizationDTO> getRolesGroupedByOrganizations(User user) {
        List<AuthOrganizationDTO> organizationDTOS = new ArrayList<>();
        // group user roles by organization and add to dto
        Map<Organization, List<Role>> groupedRoles = user.getRoles().stream().collect(Collectors.groupingBy(role -> role.getOrganization()));
        groupedRoles.keySet().forEach(organization -> {
            List<AuthOrganizationRoleDTO> roles = groupedRoles.get(organization).stream().map(AuthOrganizationRoleDTO::new).collect(Collectors.toList());
            organizationDTOS.add(new AuthOrganizationDTO(organization.getId(),organization.getName(), organization.getAvatarUrl(),roles));
        });

        //for all OrganizationUser, check if a organization is missing, and add it without roles
        List<AuthOrganizationDTO> missingOrganizations = user.getOrganizations().stream()
                .filter(organization ->
                        organizationDTOS.stream().noneMatch(organizationDTO ->
                                organizationDTO.getId().longValue() == organization.getId().longValue()
                        )
                ).map(organization -> new AuthOrganizationDTO(organization.getId(), organization.getName(), organization.getAvatarUrl(), new ArrayList<>()))
                .collect(Collectors.toList());
        organizationDTOS.addAll(missingOrganizations);

        //sort by id
        organizationDTOS.sort(new Comparator<AuthOrganizationDTO>() {
            @Override
            public int compare(AuthOrganizationDTO o1, AuthOrganizationDTO o2) {
                return Long.compare(o1.getId(),o2.getId());
            }
        });

        return organizationDTOS;
    }

    private List<AuthOrganizationDTO> getAllOrganizations(){
        return organizationService.findAll().stream()
                .map(organization ->
                        new AuthOrganizationDTO(organization.getId(),organization.getName(),organization.getAvatarUrl(),null))
                .collect(Collectors.toList());
    }

}
