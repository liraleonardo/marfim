package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.*;
import org.ipdec.marfim.api.exception.RoleException;
import org.ipdec.marfim.api.exception.type.RoleExceptionsEnum;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.Role;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.model.key.PermissionKey;
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

    private final PermissionService permissionService;

    private final IPrincipalTokenAttributes principal;

    public Role findById(Long id, Long organizationId) {
        Role role = roleRepository.findById(id).orElseThrow(()->{
            return new RoleException(RoleExceptionsEnum.NOT_FOUND);
        });
        // should find a role only if it exist on current tenant, or requester is super
            boolean isRoleFromTenantOrganization = Objects.equals(role.getOrganization().getId(), organizationId);
            if(!isRoleFromTenantOrganization){
                throw new RoleException(RoleExceptionsEnum.FORBIDDEN_ROLE_ORGANIZATION_DIFFERENT_FROM_TENANT);
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

    public List<PermissionDTO> findRolePermissionsById(Long roleId, Long tenantId) {
        Role role = findById(roleId, tenantId);
        return role.getPermissions().stream().map(PermissionDTO::new).collect(Collectors.toList());
    }

    public List<PermissionMapDTO> findGroupedRolePermissionsById(Long roleId, Long tenantId) {
        List<PermissionDTO> rolePermissionsById = findRolePermissionsById(roleId, tenantId);
        List<PermissionMapDTO> allPermissionsGrouped = permissionService.findAllPermissionsGroupedMap();
        allPermissionsGrouped.forEach(groupedPermission -> {
            List<PermissionDTO> rolePermissionsByResource = rolePermissionsById.stream()
                    .filter(rolePermission ->
                            rolePermission.getResourceCode().equalsIgnoreCase(groupedPermission.getResourceCode())).collect(Collectors.toList());
            rolePermissionsByResource.forEach(rolePermissionByResource -> {
                groupedPermission.getLevel().put(rolePermissionByResource.getLevelCode(),true);
            });
        });
        return allPermissionsGrouped;
    }

    public List<UserDTO> findRoleUsersById(Long roleId, Long tenantId) {
        Role role = findById(roleId, tenantId);
        return role.getUsers().stream().map(UserDTO::new)
                .sorted(Comparator.comparing(UserDTO::getName,String::compareToIgnoreCase))
                .collect(Collectors.toList());
    }

    public void updateRoleUsers(Long roleId, List<UserDTO> userDTOS, Long organizationId) {
        Role role = findById(roleId, organizationId);
        List<User> users = userDTOS.stream().map(userDTO -> {
            User user = new User();
            user.setId(userDTO.getId());
            return user;
        }).collect(Collectors.toList());
        role.setUsers(users);
        roleRepository.save(role);
    }

    public void updateRolePermissions(Long roleId, List<PermissionDTO> permissionDTOS, Long organizationId) {
        Role role = findById(roleId, organizationId);
        List<Permission> permissions = permissionDTOS.stream().map(permissionDTO -> {
            Permission permission = new Permission();
            PermissionKey id = new PermissionKey(permissionDTO.getResourceCode(),permissionDTO.getLevelCode());
            permission.setId(id);
            return permission;
        }).collect(Collectors.toList());
        role.setPermissions(permissions);
        roleRepository.save(role);
    }
}
