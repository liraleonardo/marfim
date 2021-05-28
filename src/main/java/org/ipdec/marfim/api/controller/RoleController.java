package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.*;
import org.ipdec.marfim.api.service.RoleService;
import org.ipdec.marfim.security.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Validated
@RestController
@RequestMapping(value = "/role",produces = "application/json" )
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN_USER')")
    public List<RoleDTO> findAll() {
        Long organizationId = TenantContext.getLongTenant();
        return roleService.findAllRolesDTO(organizationId);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN_USER')")
    public RoleDTO findOne(@PathVariable(value = "id", required = true) Long roleId) {
        Long tenantId = TenantContext.getLongTenant();
        return new RoleDTO(roleService.findById(roleId, tenantId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN_USER')")
    public CreateRoleDTO create(@RequestBody @Valid CreateRoleDTO roleDTO) {
        Long tenantId = TenantContext.getLongTenant();
        return roleService.create(roleDTO, tenantId);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN_USER')")
    public CreateRoleDTO update(@PathVariable(value = "id", required = true) Long roleId,
                       @RequestBody @Valid CreateRoleDTO roleDTO) {
        Long tenantId = TenantContext.getLongTenant();
        return roleService.update(roleId, roleDTO, tenantId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN_USER')")
    public void delete(@PathVariable(value = "id", required = true) Long roleId) {
        Long tenantId = TenantContext.getLongTenant();
        roleService.delete(roleId, tenantId);
    }

    @GetMapping("/{id}/users")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN_USER')")
    public List<UserDTO> findRoleUsers(@PathVariable(value = "id", required = true) Long roleId) {
        Long tenantId = TenantContext.getLongTenant();
        return roleService.findRoleUsersById(roleId, tenantId);
    }

    @PatchMapping("/{id}/users")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN_USER')")
    public void updateUsersFromRole(@PathVariable(value = "id", required = true) Long roleId,
                                    @RequestBody @Valid List<UserDTO> userDTOS) {
        Long tenantId = TenantContext.getLongTenant();
        roleService.updateRoleUsers(roleId,userDTOS, tenantId);
    }

    @GetMapping("/{id}/permissions")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN_USER')")
    public List<PermissionMapDTO> findRolePermissions(@PathVariable(value = "id", required = true) Long roleId) {
        Long tenantId = TenantContext.getLongTenant();
        return roleService.findGroupedRolePermissionsById(roleId, tenantId);
    }

    @PatchMapping("/{id}/permissions")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN_USER')")
    public void updatePermissionsFromRole(@PathVariable(value = "id", required = true) Long roleId,
                                    @RequestBody @Valid List<PermissionDTO> permissionDTOS) {
        Long tenantId = TenantContext.getLongTenant();
        roleService.updateRolePermissions(roleId, permissionDTOS, tenantId);
    }



}


