package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.UserDTO;
import org.ipdec.marfim.api.dto.CreateUserDTO;
import org.ipdec.marfim.api.dto.UpdateUserDTO;
import org.ipdec.marfim.api.model.User;
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
@RequestMapping(value = "/user",produces = "application/json" )
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('USERS_READ', 'USERS_ALL')")
    public List<UserDTO> findAll() {
        Long organizationId = TenantContext.getLongTenant();
        return userService.findAllUsersDTO(organizationId);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('USERS_READ', 'USERS_ALL')")
    public UserDTO findOne(@PathVariable(value = "id", required = true) UUID userId) {
        Long tenantId = TenantContext.getLongTenant();
        return new UserDTO(userService.findById(userId, tenantId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('USERS_CREATE', 'USERS_ALL')")
    public User create(@RequestBody @Valid CreateUserDTO userDTO) {
        Long tenantId = TenantContext.getLongTenant();
        return userService.create(userDTO, tenantId);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('USERS_UPDATE', 'USERS_ALL')")
    public User update(@PathVariable(value = "id", required = true) UUID userId,
                               @RequestBody @Valid UpdateUserDTO userDTO) {
        Long tenantId = TenantContext.getLongTenant();
        return userService.update(userId, userDTO, tenantId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyAuthority('USERS_DELETE', 'USERS_ALL')")
    public void delete(@PathVariable(value = "id", required = true) UUID userId) {
        Long tenantId = TenantContext.getLongTenant();
        userService.delete(userId, tenantId);
    }

}


