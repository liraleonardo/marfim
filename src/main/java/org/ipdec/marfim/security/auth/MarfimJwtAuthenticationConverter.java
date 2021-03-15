package org.ipdec.marfim.security.auth;

import org.ipdec.marfim.api.model.Permission;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.DefaultOAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;

import java.util.*;

public class MarfimJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

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
        List<LinkedHashMap<String,String>> authorities = jwt.getClaim("authorities");
        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        authorities.forEach(item -> {
            Permission permission = new Permission();
            permission.setName(item.get("name"));
            permission.setDescription(item.get("description"));
            GrantedAuthority grantedAuthority = permission;
            grantedAuthorities.add(grantedAuthority);
        });

        return grantedAuthorities;

    }


}
