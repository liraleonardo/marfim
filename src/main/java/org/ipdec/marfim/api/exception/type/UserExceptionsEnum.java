package org.ipdec.marfim.api.exception.type;


import lombok.Getter;
import org.springframework.http.HttpStatus;

public enum UserExceptionsEnum {
    FORBIDDEN_USER_ORGANIZATION_DOES_NOT_MATCH(HttpStatus.FORBIDDEN, "requested user organization id does not match the Tenant-ID"),
    NOT_FOUND(HttpStatus.NOT_FOUND,"user not found"),
    CONFLICT_USER_SAME_EMAIL(HttpStatus.CONFLICT,"there is another user with this email");


    @Getter
    private HttpStatus status;

    @Getter
    private String message;

    UserExceptionsEnum(HttpStatus status, String message){
        this.status = status;
        this.message = message;
    }
}