package org.ipdec.marfim.api.exception;

import org.ipdec.marfim.api.exception.type.UserExceptionsEnum;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class UserException extends ResponseStatusException {

    public UserException(UserExceptionsEnum exceptionsEnum){
        super(exceptionsEnum.getStatus(),exceptionsEnum.getMessage());
    }

    public UserException(HttpStatus status, String reason) {
        super(status, reason);
    }
}
