package org.ipdec.marfim.api.exception;

import org.ipdec.marfim.api.exception.type.RoleExceptionsEnum;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class RoleException extends ResponseStatusException {

    public RoleException(RoleExceptionsEnum exceptionsEnum){
        super(exceptionsEnum.getStatus(),exceptionsEnum.getMessage());
    }

    public RoleException(HttpStatus status, String reason) {
        super(status, reason);
    }
}
