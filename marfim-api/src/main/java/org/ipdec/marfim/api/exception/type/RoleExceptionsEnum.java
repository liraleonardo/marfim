package org.ipdec.marfim.api.exception.type;


import lombok.Getter;
import org.springframework.http.HttpStatus;

public enum RoleExceptionsEnum {
    FORBIDDEN_ROLE_ORGANIZATION_DIFFERENT_FROM_TENANT(HttpStatus.FORBIDDEN, "requested role is not from current tenant organization"),
    NOT_FOUND(HttpStatus.NOT_FOUND,"user not found");

    @Getter
    private HttpStatus status;

    @Getter
    private String message;

    RoleExceptionsEnum(HttpStatus status, String message){
        this.status = status;
        this.message = message;
    }
}