package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.RegisterUserDTO;
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

    public User register(RegisterUserDTO registerUserDTO) {
        boolean userFound = this.userRepository.findByEmail(registerUserDTO.getEmail()).isPresent();

        if(userFound){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"user already registered");
        }

        User user = new User();
        user.setName(registerUserDTO.getName());
        user.setEmail(registerUserDTO.getEmail().toLowerCase().replaceAll("\\s", "").replaceAll("\\t", ""));
        user.setPassword(encoder.encode(registerUserDTO.getPassword()));
        user = this.userRepository.save(user);

        return user;
    }

}
