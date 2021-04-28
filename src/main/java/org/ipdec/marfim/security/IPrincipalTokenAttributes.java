package org.ipdec.marfim.security;

import org.ipdec.marfim.api.model.User;

public interface IPrincipalTokenAttributes {
    public User getUser();
    //TODO: create another methods for other available information
}
