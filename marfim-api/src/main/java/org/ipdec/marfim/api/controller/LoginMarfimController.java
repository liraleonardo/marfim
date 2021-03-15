package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.AuthDTO;
import org.ipdec.marfim.api.dto.LoginMarfimDTO;
import org.ipdec.marfim.api.service.LoginMarfimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(value = "/login/marfim",produces = "application/json" )
public class LoginMarfimController {

    @Autowired
    LoginMarfimService loginMarfimService;

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public AuthDTO login(@RequestBody @Valid LoginMarfimDTO dto) {
        return loginMarfimService.login(dto);
    }

}


