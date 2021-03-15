package org.ipdec.marfim.security.auth;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.apache.http.client.HttpResponseException;
import org.ipdec.marfim.api.exception.dto.ResponseErrorDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Component
public class AuthenticationExceptionEntryPoint implements AuthenticationEntryPoint {
	@Autowired
	ObjectMapper objectMapper;

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
		//TODO: review forbidden
		response.setStatus(HttpStatus.UNAUTHORIZED.value());
		ResponseErrorDTO responseErrorDTO = new ResponseErrorDTO(request.getServletPath(),HttpStatus.UNAUTHORIZED,authException.getMessage(),authException.getClass().getName());
		response.getOutputStream().println(objectMapper.writeValueAsString(responseErrorDTO));
	}

}