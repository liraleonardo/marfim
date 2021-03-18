package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.CreateUserDTO;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

//    @PreAuthorize("hasAnyAuthority('READ_USERS','MANAGE_USERS')")
//    @PreAuthorize("hasAnyRole('COORDENADOR')")
//    @RolesAllowed("COORDENADOR")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'READ_USERS','MANAGE_USERS')")
    public List<User> findAll() {
        return userRepository.findAll();
    }

}
