package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.CreateRoleDTO;
import org.ipdec.marfim.api.dto.RoleDTO;
import org.ipdec.marfim.api.exception.RoleException;
import org.ipdec.marfim.api.exception.type.RoleExceptionsEnum;
import org.ipdec.marfim.api.model.Organization;
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
        // should find a role only if it exist on current tenant, or requester is super
        if(!principal.getUser().isSuper()){
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


    public CreateRoleDTO create(CreateRoleDTO roleDTO, Long organizationId) {
        if(organizationId==null){
            throw new RoleException(RoleExceptionsEnum.BAD_REQUEST_MISSING_TENANT_ID);
        }
        Role role = roleDTO.parseToRole(new Role());

        Organization organization = new Organization();
        organization.setId(organizationId);
        role.setOrganization(organization);

        boolean isRoleSameName = roleRepository.findByNameAndOrganizationId(role.getName(), role.getOrganization().getId()).isPresent();
        if(isRoleSameName){
            throw new RoleException(RoleExceptionsEnum.CONFLICT_ROLE_SAME_NAME);
        }

        role = roleRepository.save(role);
        return new CreateRoleDTO(role);
    }

    public CreateRoleDTO update(Long roleId, CreateRoleDTO roleDTO, Long organizationId) {
        if(organizationId==null){
            throw new RoleException(RoleExceptionsEnum.BAD_REQUEST_MISSING_TENANT_ID);
        }
        roleDTO.setId(roleId);

        Role originalRole = findById(roleId, organizationId);
        Role roleToSave = roleDTO.parseToRole(originalRole);

        Organization organization = new Organization();
        organization.setId(organizationId);
        roleToSave.setOrganization(organization);

        Optional<Role> roleSameName = roleRepository.findByNameAndOrganizationId(roleToSave.getName(), roleToSave.getOrganization().getId());
        if(roleSameName.isPresent() && !Objects.equals(roleSameName.get().getId(),roleId)){
            throw new RoleException(RoleExceptionsEnum.CONFLICT_ROLE_SAME_NAME);
        }

        roleToSave = roleRepository.save(roleToSave);

        return new CreateRoleDTO(roleToSave);
    }

    public void delete(Long roleId, Long organizationId) {
        if(organizationId==null){
            throw new RoleException(RoleExceptionsEnum.BAD_REQUEST_MISSING_TENANT_ID);
        }
        roleRepository.deleteById(roleId);
    }
}
