package org.ipdec.marfim.security.auth.marfim;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.*;
import io.jsonwebtoken.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.ipdec.marfim.api.model.Role;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.config.properties.OAuthProperties;
import org.ipdec.marfim.security.MarfimUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class MarfimJWTToken {
	private final int EXPIRES_IN_DAYS = 1;
	private final String HEADER_AUTHORIZATION = "Authorization";
	private final String HEADER_PREFIX = "Bearer ";

	@Getter(AccessLevel.PRIVATE)
	@Setter(AccessLevel.PRIVATE)
	private OAuthProperties properties;

	@Getter(AccessLevel.PRIVATE)
	@Setter(AccessLevel.PRIVATE)
	private ObjectMapper mapper;

	private Gson gson;

	@Autowired
	public MarfimJWTToken(OAuthProperties properties, ObjectMapper mapper) {
		setProperties(properties);
		setMapper(mapper);

		gson = new GsonBuilder().registerTypeAdapter(LocalDateTime.class, new JsonDeserializer<LocalDateTime>() {
			@Override
			public LocalDateTime deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
					throws JsonParseException {
				return LocalDateTime.parse(json.getAsString());
			}
		}).create();
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

	public String getToken(HttpServletRequest request) {
		if (request.getHeader(HEADER_AUTHORIZATION) != null && request.getHeader(HEADER_AUTHORIZATION).startsWith(HEADER_PREFIX)) {
			return request.getHeader(HEADER_AUTHORIZATION).substring(HEADER_PREFIX.length());
		}
		return null;
	}

	public User getUser(String token) {
		try {
			return gson.fromJson(new Gson().toJson(Objects.requireNonNull(getClaims(token).get("user"))), User.class);
		} catch (Exception e) {
			return null;
		}
	}

	public Boolean validateToken(String token, UserDetails userDetails) {
		MarfimUserDetails marfimUserDetails = (MarfimUserDetails) userDetails;
		Date created = issuedAt(token);
		Date expiration	= expiresAt(token);
		Date now = new Date();

		return (marfimUserDetails != null && now.before(expiration) && now.after(created));
	}

	private Claims getClaims(String token) {
		try {
			return Jwts.parser().setSigningKey(getProperties().getAppSecret()).parseClaimsJws(token).getBody();
		} catch (Exception e) {
			return null;
		}
	}

	private JwsHeader getHeader(String token) {
		try {
			return Jwts.parser().setSigningKey(getProperties().getAppSecret()).parseClaimsJws(token).getHeader();
		} catch (Exception e) {
			return null;
		}
	}

	public Jwt getJwt(String token){
		var header = getHeader(token);
		HashMap<String, Object> headerMap = mapper.convertValue(header, HashMap.class);

		var claims = getClaims(token);
		HashMap<String, Object> claimsMap = mapper.convertValue(claims,HashMap.class);

		return new Jwt(token,claims.getIssuedAt().toInstant(),claims.getExpiration().toInstant(),headerMap,claimsMap);
	}


	private Date expiresAt(String token) {
		return Objects.requireNonNull(getClaims(token)).getExpiration();
	}

	private Date issuedAt(String token) {
		return Objects.requireNonNull(getClaims(token)).getIssuedAt();
	}

}