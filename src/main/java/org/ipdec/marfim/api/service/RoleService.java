package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.RoleDTO;
import org.ipdec.marfim.api.exception.RoleException;
import org.ipdec.marfim.api.exception.type.RoleExceptionsEnum;
import org.ipdec.marfim.api.model.Role;
import org.ipdec.marfim.api.repository.RoleRepository;
import org.ipdec.marfim.security.IPrincipalTokenAttributes;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    private final IPrincipalTokenAttributes principal;

    public Role findById(Long id, Long organizationId) {
        Role role = roleRepository.findById(id).orElseThrow(()->{
            return new RoleException(RoleExceptionsEnum.NOT_FOUND);
        });
        // should find a role only if it exist on current tenant
        if(organizationId!=null){
            boolean isRoleFromTenantOrganization = Objects.equals(role.getOrganization().getId(), organizationId);
            if(!isRoleFromTenantOrganization){
                throw new RoleException(RoleExceptionsEnum.FORBIDDEN_ROLE_ORGANIZATION_DIFFERENT_FROM_TENANT);
            }
        }
        return role;
    }


    public List<Role> findAll() {
        return roleRepository.findAll(Sort.by(Sort.Order.asc("name").ignoreCase()));
    }

    public List<Role> findAll(Long organizationId) {
        List<Role> allRoles = findAll();
        if(organizationId==null) {
            return allRoles;
        }

        return allRoles.stream().filter(role -> {
            return Objects.equals(role.getOrganization().getId(), organizationId);
        }).collect(Collectors.toList());

    }

    public List<RoleDTO> findAllRolesDTO(Long organizationId) {
        return findAll(organizationId).stream().map(RoleDTO::new)
                .collect(Collectors.toList());
    }




}
