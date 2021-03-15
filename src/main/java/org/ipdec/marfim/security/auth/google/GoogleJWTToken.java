package org.ipdec.marfim.security.auth.google;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import org.ipdec.marfim.config.properties.OAuthProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class GoogleJWTToken {
	@Getter(AccessLevel.PRIVATE)
	@Setter(AccessLevel.PRIVATE)
	private OAuthProperties properties;

	@Getter(AccessLevel.PRIVATE)
	@Setter(AccessLevel.PRIVATE)
	private GoogleTokenHandler googleTokenHandler;

	@Autowired
	public GoogleJWTToken(OAuthProperties properties) {
		setProperties(properties);
		setGoogleTokenHandler(new GoogleTokenHandler(new String[]{properties.getClientId()},properties.getClientId()));
	}

	public GoogleIdToken.Payload getTokenPayload(String token) {
		GoogleIdToken parsedToken = googleTokenHandler.parse(token);
		return  parsedToken != null ? parsedToken.getPayload() : null;
	}

	public Boolean validateToken(String token) {
		GoogleIdToken.Payload jwt = googleTokenHandler.check(token);
		return (jwt != null);
	}

	public String getProblem(){
		return googleTokenHandler.problem();
	}

}