package org.ipdec.marfim.security.auth;

import org.ipdec.marfim.security.MarfimUserDetails;
import org.ipdec.marfim.security.MarfimUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class MarfimUsernamePasswordAuthenticationManager implements AuthenticationManager {

	private MarfimUserDetailsService service;
	private PasswordEncoder encoder;

	@Autowired
	public MarfimUsernamePasswordAuthenticationManager(MarfimUserDetailsService service, PasswordEncoder encoder) {
		this.service = service;
		this.encoder = encoder;
	}

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {

		String username	= (String) authentication.getPrincipal();
		String password	= (String) authentication.getCredentials(); //TODO: codificar a senha!!!
		MarfimUserDetails userDetails = (MarfimUserDetails) service.loadUserByUsername(username);

		if (userDetails == null)
			throw new UsernameNotFoundException("User not found.");

		if (!userDetails.isEnabled())
			throw new DisabledException("User not enabled.");

		if (!encoder.matches(password, userDetails.getPassword()))
			throw new BadCredentialsException("Email or password does not match");

		return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
	}
}
