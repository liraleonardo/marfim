package org.ipdec.marfim.api.exception.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.http.HttpStatus;


import java.time.LocalDateTime;
import java.util.Collection;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseErrorDTO {
    private Integer status;
    private String path;
    private LocalDateTime date;
    private String message;
    private String error;
    private Collection<Object> errors;

    public ResponseErrorDTO(String path){
        this(path, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseErrorDTO(String path, HttpStatus status){
        this( path, status, status.getReasonPhrase(), status.getReasonPhrase());
    }

    public ResponseErrorDTO(String path, HttpStatus status, String message){
        this(path, status, message, status.getReasonPhrase());
    }

    public ResponseErrorDTO(String path, HttpStatus status, String message, String error ){
        this(path, status, message, error, null);
    }

    public ResponseErrorDTO(String path, HttpStatus status, String message, String error, Collection<Object> errors ){
        this.status = status.value();
        this.path = path;
        this.date = LocalDateTime.now();
        this.message = message;
        this.error = error;
        this.errors = errors;
    }
}
