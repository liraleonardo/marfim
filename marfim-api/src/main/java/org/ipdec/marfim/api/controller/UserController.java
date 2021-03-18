package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public List<User> findAll() {
        return userService.findAll();
    }

}


