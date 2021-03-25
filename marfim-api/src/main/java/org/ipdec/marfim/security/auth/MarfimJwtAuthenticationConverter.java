package org.ipdec.marfim.security.auth;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.service.AuthorizationUtilService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.DefaultOAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
public class MarfimJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private AuthorizationUtilService authorizationUtilService;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        OAuth2AccessToken accessToken = new OAuth2AccessToken(OAuth2AccessToken.TokenType.BEARER, jwt.getTokenValue(),
                jwt.getIssuedAt(), jwt.getExpiresAt());
        Map<String, Object> attributes = jwt.getClaims();
        Collection<GrantedAuthority> authorities = getAuthorities(jwt);
        OAuth2AuthenticatedPrincipal principal = new DefaultOAuth2AuthenticatedPrincipal(attributes, authorities);
        return new BearerTokenAuthentication(principal, accessToken, authorities);
    }

    private Collection<GrantedAuthority> getAuthorities(Jwt jwt) {
        Boolean isSuper = jwt.getClaim("isSuper");
        List<Integer> roleIdListInt = jwt.getClaim("roles");
        List<Long> roleIdList = roleIdListInt.stream().mapToLong(Integer::longValue).boxed().collect(Collectors.toList());

        return new ArrayList<>(authorizationUtilService.getUserAuthoritiesByRoleIds(roleIdList, isSuper));
    }


}
