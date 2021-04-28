package org.ipdec.marfim.api.exception;

import org.ipdec.marfim.api.exception.type.OrganizationExceptionsEnum;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class OrganizationException extends ResponseStatusException {

    public OrganizationException(OrganizationExceptionsEnum exceptionsEnum){
        super(exceptionsEnum.getStatus(),exceptionsEnum.getMessage());
    }

    public OrganizationException(HttpStatus status, String reason) {
        super(status, reason);
    }
}
