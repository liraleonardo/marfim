package org.ipdec.marfim.api.exception.type;


import lombok.Getter;
import org.springframework.http.HttpStatus;

public enum UserExceptionsEnum {
    FORBIDDEN_USER_ORGANIZATION_DIFFERENT_FROM_TENANT(HttpStatus.FORBIDDEN, "requested user is not from current tenant organization"),
    FORBIDDEN_UPDATE_SUPER_USER_BY_NON_SUPER_USER(HttpStatus.FORBIDDEN, "a super user can only be updated by another super user"),
    FORBIDDEN_BECOME_SUPER_USER_BY_NON_SUPER_USER(HttpStatus.FORBIDDEN, "only a super user can grant super user privileges"),
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