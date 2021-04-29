package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.RoleDTO;
import org.ipdec.marfim.api.service.RoleService;
import org.ipdec.marfim.security.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping(value = "/role",produces = "application/json" )
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLES_READ', 'ROLES_ALL')")
    public List<RoleDTO> findAll() {
        Long organizationId = TenantContext.getLongTenant();
        return roleService.findAllRolesDTO(organizationId);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLES_READ', 'ROLES_ALL')")
    public RoleDTO findOne(@PathVariable(value = "id", required = true) Long userId) {
        Long tenantId = TenantContext.getLongTenant();
        return new RoleDTO(roleService.findById(userId, tenantId));
    }



}


