package org.ipdec.marfim.security.auth.marfim;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.ipdec.marfim.api.model.Role;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.config.properties.OAuthProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class MarfimJWTToken {
	private final int EXPIRES_IN_DAYS = 1;

	@Getter(AccessLevel.PRIVATE)
	@Setter(AccessLevel.PRIVATE)
	private OAuthProperties properties;

	@Getter(AccessLevel.PRIVATE)
	@Setter(AccessLevel.PRIVATE)
	private ObjectMapper mapper;

	@Autowired
	public MarfimJWTToken(OAuthProperties properties, ObjectMapper mapper) {
		setProperties(properties);
		setMapper(mapper);
	}


	public String generateToken(User user) {
		// Token generation
		JwtBuilder jwtBuilder = Jwts.builder();

		//adding user on token
		jwtBuilder.setClaims(mapper.convertValue(user, HashMap.class));

		//adding user role ids on token
		List<Long> roleIdList = user.getRoles().stream().map(Role::getId).collect(Collectors.toList());
		HashMap<String, Object> scopeClaims = new HashMap<>();
		scopeClaims.put("roles",roleIdList);
		jwtBuilder.addClaims(scopeClaims);

		//adding other jwt claims
		jwtBuilder.setSubject(user.getId().toString());
		jwtBuilder.setIssuer(getProperties().getAppName());
		jwtBuilder.setIssuedAt(new Date());
		jwtBuilder.setExpiration(new Date(new Date().getTime() + (EXPIRES_IN_DAYS * 1000 * 3600 * 24)));
		jwtBuilder.signWith(SignatureAlgorithm.HS512, getProperties().getAppSecret());
		return jwtBuilder.compact();
	}

	public Jwt getJwt(String token){
		Jws<Claims> claimsJws = Jwts.parser().setSigningKey(getProperties().getAppSecret()).parseClaimsJws(token);

		var header = claimsJws.getHeader();
		HashMap<String, Object> headerMap = mapper.convertValue(header, HashMap.class);

		var claims = claimsJws.getBody();
		HashMap<String, Object> claimsMap = mapper.convertValue(claims,HashMap.class);

		return new Jwt(token,claims.getIssuedAt().toInstant(),claims.getExpiration().toInstant(),headerMap,claimsMap);
	}


}