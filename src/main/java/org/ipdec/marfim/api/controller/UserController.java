package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.AllUsersDTO;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.service.UserService;
import org.ipdec.marfim.security.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping(value = "/user",produces = "application/json" )
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    //    @PreAuthorize("hasAnyAuthority('READ_USERS','MANAGE_USERS')")
//    @PreAuthorize("hasAnyRole('COORDENADOR')")
//    @RolesAllowed("COORDENADOR")
    @PreAuthorize("hasAnyAuthority('USERS_READ')")
    public List<AllUsersDTO> findAll() {
        Long organizationId = TenantContext.getLongTenant();
        return userService.findAllUsersDTO(organizationId);
    }

}


