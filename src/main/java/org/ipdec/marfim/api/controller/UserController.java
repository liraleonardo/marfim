package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
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
    private UserRepository userRepository;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
//    @PreAuthorize("hasAnyAuthority('READ_USERS','MANAGE_USERS')")
//    @PreAuthorize("hasAnyRole('COORDENADOR')")
//    @RolesAllowed("COORDENADOR")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'READ_USERS','MANAGE_USERS')")
    public List<User> findAll() {
        return userRepository.findAll();
    }

}


