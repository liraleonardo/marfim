package org.ipdec.marfim.security.auth.marfim;

import lombok.NonNull;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.security.MyUserDetailsService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtBearerTokenAuthenticationConverter;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class MarfimTokenAuthenticationFilter extends OncePerRequestFilter {
	private MarfimJWTToken marfimJWTToken;
	private MyUserDetailsService service;

	public MarfimTokenAuthenticationFilter(MarfimJWTToken marfimJWTToken, MyUserDetailsService service) {
		this.marfimJWTToken = marfimJWTToken;
		this.service = service;
	}

	@Override
	public void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain chain) {
		try {
			String token = marfimJWTToken.getToken(request);
			User tokenUser = token != null? marfimJWTToken.getUser(token) : null;
			UserDetails details	= tokenUser != null? service.loadUserByUsername(tokenUser.getEmail()) : null;

			if (details != null && marfimJWTToken.validateToken(token, details)) {
				JwtBearerTokenAuthenticationConverter jwtBearerTokenAuthenticationConverter = new JwtBearerTokenAuthenticationConverter();
				BearerTokenAuthentication authenticationToken = (BearerTokenAuthentication) jwtBearerTokenAuthenticationConverter.convert(marfimJWTToken.getJwt(token));


				SecurityContextHolder.getContext().setAuthentication(authenticationToken);
			}

			chain.doFilter(request, response);

		} catch (IOException | ServletException | BadCredentialsException e) {
			System.out.println(e.getMessage());
		}
	}

}