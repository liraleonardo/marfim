package org.ipdec.marfim.api.exception.type;


import lombok.Getter;
import org.springframework.http.HttpStatus;

public enum RoleExceptionsEnum {
    FORBIDDEN_ROLE_ORGANIZATION_DIFFERENT_FROM_TENANT(HttpStatus.FORBIDDEN, "requested role is not from current tenant organization"),
    FORBIDDEN_SET_ADMIN_ROLE_BY_NON_SUPER_OR_ADMIN(HttpStatus.FORBIDDEN, "only a super user or admin can set admin role privileges"),
    FORBIDDEN_UPDATE_ADMIN_ROLE_BY_NON_SUPER_OR_ADMIN(HttpStatus.FORBIDDEN, "only a super user or admin can update an admin role"),
    BAD_REQUEST_MISSING_ROLE_ORGANIZATION(HttpStatus.BAD_REQUEST, "missing role organization"),
    CONFLICT_ROLE_SAME_NAME(HttpStatus.CONFLICT,"there is another role with this name on organization"),
    NOT_FOUND(HttpStatus.NOT_FOUND,"role not found");

    @Getter
    private HttpStatus status;

    @Getter
    private String message;

    RoleExceptionsEnum(HttpStatus status, String message){
        this.status = status;
        this.message = message;
    }
}