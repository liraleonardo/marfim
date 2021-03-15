package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.CreateUserDTO;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Service
@AllArgsConstructor
public class UserRegisterService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public User register(CreateUserDTO createUserDTO) {
        boolean userFound = this.userRepository.findByEmail(createUserDTO.getEmail()).isPresent();

        if(userFound){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"user already registered");
        }

        User user = new User();
        user.setName(createUserDTO.getName());
        user.setEmail(createUserDTO.getEmail().toLowerCase().replaceAll("\\s", "").replaceAll("\\t", ""));
        user.setPassword(encoder.encode(createUserDTO.getPassword()));
        user = this.userRepository.save(user);

        return user;
    }

}
