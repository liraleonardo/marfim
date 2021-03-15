package org.ipdec.marfim.security.auth;

import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;

import javax.servlet.http.HttpServletRequest;

public class MarfimBearerTokenResolver implements BearerTokenResolver {
    private static final String HEADER_AUTHORIZATION = "Authorization";
    private static final String HEADER_PREFIX = "Bearer ";

    @Override
    public String resolve(HttpServletRequest request) {
        if (request.getHeader(HEADER_AUTHORIZATION) != null && request.getHeader(HEADER_AUTHORIZATION).startsWith(HEADER_PREFIX)) {
            return request.getHeader(HEADER_AUTHORIZATION).substring(HEADER_PREFIX.length());
        }
        return null;
    }
}
