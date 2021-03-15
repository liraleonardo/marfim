package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.AuthDTO;
import org.ipdec.marfim.api.dto.LoginGoogleDTO;
import org.ipdec.marfim.api.service.LoginGoogleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Validated
@RestController
@RequestMapping(value = "/login/google",produces = "application/json" )
public class LoginGoogleController {

    @Autowired
    LoginGoogleService loginGoogleService;

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public AuthDTO login(@RequestBody @Valid LoginGoogleDTO dto) {
        return loginGoogleService.login(dto.getToken());
   }


}


