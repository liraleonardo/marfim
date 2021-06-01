package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.RoleDTO;
import org.ipdec.marfim.api.service.UserService;
import org.ipdec.marfim.security.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@Validated
@RestController
@RequestMapping(value = "/user/{id}/roles",produces = "application/json" )
public class UserRolesController {

    @Autowired
    private UserService userService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN_USER')")
    public List<RoleDTO> findRoleUsers(@PathVariable(value = "id", required = true) UUID userId) {
        Long tenantId = TenantContext.getLongTenant();
        return userService.findUserRolesById(userId, tenantId);
    }

    @PatchMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN_USER')")
    public void updateUsersFromRole(@PathVariable(value = "id", required = true) UUID userId,
                                    @RequestBody @Valid List<RoleDTO> roleDTOS) {
        Long tenantId = TenantContext.getLongTenant();
        userService.updateUserRoles(userId,roleDTOS, tenantId);
    }

}


