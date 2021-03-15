package org.ipdec.marfim.security.auth;

import org.ipdec.marfim.security.auth.marfim.MarfimJWTToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

@Component
public class MarfimJwtDecoder implements JwtDecoder {


    private final MarfimJWTToken marfimJWTToken;

    @Autowired
    public MarfimJwtDecoder(MarfimJWTToken marfimJWTToken) {
        this.marfimJWTToken = marfimJWTToken;
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        return marfimJWTToken.getJwt(token);
    }
}
