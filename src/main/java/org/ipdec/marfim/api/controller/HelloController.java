package org.ipdec.marfim.api.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//TODO: APAGAR ROTA
@RestController
public class HelloController {

    @RequestMapping("/")
    public String hello() {
        return "Olá Marfim!";
    }

    @RequestMapping("/inside")
    public String inside(BearerTokenAuthentication authenticationToken, @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        return String.format("Olá de dentro do Servidor de Recursos do Marfim! \n\tAuthentication Token: %s \n\tOAuth2AuthenticatedPrincipal NAME: %s \n\tOAuth2AuthenticatedPrincipal AUTHORITIES: %s \n\tOAuth2AuthenticatedPrincipal ATTRIBUTES: %s",authenticationToken, principal.getName(),principal.getAuthorities(),principal.getAttributes());
    }


}


