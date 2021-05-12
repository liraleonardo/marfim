package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.security.permission.CustomAuthority;
import org.ipdec.marfim.security.tenant.TenantContext;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/my",produces = "application/json" )
public class MyInfosController {

    @GetMapping(value = "/authorities")
    @ResponseStatus(HttpStatus.OK)
    public List<String> findAllAuthorities(@AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        Long tenantId = TenantContext.getLongTenant();
        return principal.getAuthorities().stream()
                .filter(grantedAuthority ->
                    Objects.equals(((CustomAuthority) grantedAuthority).getOrganizationId(),tenantId)
                        ||  grantedAuthority.getAuthority().equalsIgnoreCase("ROLE_SUPER_USER")
                )
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }


}


