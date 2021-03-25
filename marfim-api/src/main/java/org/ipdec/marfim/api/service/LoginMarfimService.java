package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.AuthDTO;
import org.ipdec.marfim.api.dto.LoginMarfimDTO;
import org.ipdec.marfim.security.MarfimUserDetails;
import org.ipdec.marfim.security.auth.MarfimUsernamePasswordAuthenticationManager;
import org.ipdec.marfim.security.auth.marfim.MarfimJWTToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class LoginMarfimService {

    @Autowired
    MarfimUsernamePasswordAuthenticationManager authenticationManager;

    @Autowired
    MarfimJWTToken marfimJWTToken;

    @Autowired
    AuthenticationUtilService authenticationUtilService;

    public AuthDTO login(LoginMarfimDTO dto) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        MarfimUserDetails userDetails = (MarfimUserDetails) authentication.getPrincipal();

        return  authenticationUtilService.createAuthDTO(userDetails.getUser());
    }

}
