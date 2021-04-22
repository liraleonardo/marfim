package org.ipdec.marfim.api.exception.type;


import lombok.Getter;
import org.springframework.http.HttpStatus;

public enum OrganizationExceptionsEnum {
    FORBIDDEN_CREATE_AND_DELETE_BY_NON_SUPER_USER(HttpStatus.FORBIDDEN, "only a SUPER_USER can create or delete a organization"),
    FORBIDDEN_ORGANIZATION_ID_DOES_NOT_MATCH(HttpStatus.FORBIDDEN, "requested organization id does not match the Tenant-ID"),
    NOT_FOUND(HttpStatus.NOT_FOUND,"organization not found"),
    CONFLICT_ORGANIZATION_SAME_NAME(HttpStatus.CONFLICT,"there is another organization with this name"),
    CONFLICT_ORGANIZATION_SAME_CNPJ(HttpStatus.CONFLICT,"there is another organization with this cnpj");

    @Getter
    private HttpStatus status;

    @Getter
    private String message;

    OrganizationExceptionsEnum(HttpStatus status, String message){
        this.status = status;
        this.message = message;
    }
}