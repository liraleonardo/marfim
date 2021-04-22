package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.AllUsersDTO;
import org.ipdec.marfim.api.dto.CreateUserDTO;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;


    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<User> findAll(Long organizationId) {
        List<User> allUsers = findAll();
        if(organizationId==null) {
            return allUsers;
        }

        return allUsers.stream().filter(user -> {
            return user.getOrganizations().stream().anyMatch(userOrganization ->
                    userOrganization.getId().longValue() == organizationId);
        }).collect(Collectors.toList());

    }

    public List<AllUsersDTO> findAllUsersDTO(Long organizationId) {
        return findAll(organizationId).stream().map(AllUsersDTO::new)
                .collect(Collectors.toList());
    }

}
