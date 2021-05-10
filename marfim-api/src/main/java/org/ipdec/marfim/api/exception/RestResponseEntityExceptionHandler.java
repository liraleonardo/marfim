package org.ipdec.marfim.api.exception;

import org.ipdec.marfim.api.exception.dto.ResponseErrorDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.util.WebUtils;

import javax.annotation.Nullable;
import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@RestControllerAdvice
public class RestResponseEntityExceptionHandler
        extends ResponseEntityExceptionHandler {

    Logger log = LoggerFactory.getLogger(RestResponseEntityExceptionHandler.class);

    @ExceptionHandler({ RuntimeException.class })
    @ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseErrorDTO handleRunTimeException(RuntimeException ex, WebRequest request) {
        log.warn( "RuntimeException ...", ex);
        String path = Objects.requireNonNull(((ServletWebRequest) request).getNativeRequest(HttpServletRequest.class)).getRequestURI();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = String.format("RuntimeException (%s): %s",ex.getClass().getSimpleName(),ex.getMessage());
        return new ResponseErrorDTO(path,status,message,ex.getClass().getName());
    }

    @ExceptionHandler({ AccessDeniedException.class })
    @ResponseStatus(value=HttpStatus.FORBIDDEN)
    public ResponseErrorDTO handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        String path = Objects.requireNonNull(((ServletWebRequest) request).getNativeRequest(HttpServletRequest.class)).getRequestURI();
        HttpStatus status = HttpStatus.FORBIDDEN;
        String message = "User does not have authorization to access this resource";
        return new ResponseErrorDTO(path,status,message,ex.getClass().getName());
    }

    @ExceptionHandler({ AuthenticationException.class })
    @ResponseStatus(value=HttpStatus.UNAUTHORIZED)
    public ResponseErrorDTO handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        String path = Objects.requireNonNull(((ServletWebRequest) request).getNativeRequest(HttpServletRequest.class)).getRequestURI();
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        String message = ex.getMessage();
        String error = ex.getClass().getName();
        return new ResponseErrorDTO(path,status,message,error);
    }

    @ExceptionHandler({ResponseStatusException.class})
    public ResponseErrorDTO handleResponseStatusException(ResponseStatusException ex, WebRequest request) {
        String path = Objects.requireNonNull(((ServletWebRequest) request).getNativeRequest(HttpServletRequest.class)).getRequestURI();
        HttpStatus status = ex.getStatus();
        String message = ex.getReason();
        String error = Arrays.stream(ex.getStackTrace()).findFirst().get().getClassName();

        //setting status code to override default status from controllers
        ((ServletWebRequest) request).getResponse().setStatus(status.value());
        return new ResponseErrorDTO(path,status,message,error);
    }

    @ExceptionHandler({DataIntegrityViolationException.class})
    @ResponseStatus(value=HttpStatus.CONFLICT)
    public ResponseErrorDTO handleDataIntegrityViolationException(DataIntegrityViolationException ex, WebRequest request) {
        String path = Objects.requireNonNull(((ServletWebRequest) request).getNativeRequest(HttpServletRequest.class)).getRequestURI();
        HttpStatus status = HttpStatus.CONFLICT;
        String message;
        String error;
        if(ex.getRootCause()!=null) {
             message = String.format("data integrity violation: %s", ex.getRootCause().getMessage());
             error = ex.getRootCause().getClass().getName();
        }else{
            message = String.format("data integrity violation: %s", ex.getMessage());
            error = ex.getClass().getName();
        }


        return new ResponseErrorDTO(path,status,message,error);
    }



    // overrides ResponseEntityExceptionHandler method handleMethodArgumentNotValid to add a body when there are invalid argument errors during validation
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        String path = Objects.requireNonNull(((ServletWebRequest) request).getNativeRequest(HttpServletRequest.class)).getRequestURI();
        String error = ex.getClass().getName();
        List<ObjectError> allErrors = ex.getBindingResult().getAllErrors();
        String message = "Method Arguments Not Valid";
        List<String> allErrorStrs = allErrors.stream().map(err -> err.getDefaultMessage()).collect(Collectors.toList());
        if(allErrorStrs.size()>0) message = message.concat(": "+allErrorStrs.toString());

        return new ResponseEntity<>(new ResponseErrorDTO(path,status,message,error, Collections.singleton(allErrors)),headers,status);
    }

    // overrides ResponseEntityExceptionHandler method handleExceptionInternal to add a default body for all handled errors
    @Override
    protected  ResponseEntity<Object> handleExceptionInternal(Exception ex, @Nullable Object body, HttpHeaders headers, HttpStatus status, WebRequest request){
        if (HttpStatus.INTERNAL_SERVER_ERROR.equals(status)) {
            request.setAttribute(WebUtils.ERROR_EXCEPTION_ATTRIBUTE, ex, WebRequest.SCOPE_REQUEST);
        }
        if(body == null){
            String path = Objects.requireNonNull(((ServletWebRequest) request).getNativeRequest(HttpServletRequest.class)).getRequestURI();
            String error = ex.getClass().getName();
            String message = ex.getMessage();
            body = new ResponseErrorDTO(path,status,message,error);
        }
        return new ResponseEntity<>(body, headers, status);
    }


}