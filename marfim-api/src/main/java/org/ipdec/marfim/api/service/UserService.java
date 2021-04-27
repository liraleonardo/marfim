package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.AllUsersDTO;
import org.ipdec.marfim.api.dto.CreateUserDTO;
import org.ipdec.marfim.api.exception.UserException;
import org.ipdec.marfim.api.exception.type.UserExceptionsEnum;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder encoder;

    public User findById(UUID id) {
        return userRepository.findById(id).orElseThrow(()->{
            return new UserException(UserExceptionsEnum.NOT_FOUND);
        });
    }


    public List<User> findAll() {
        return userRepository.findAll(Sort.by(Sort.Order.asc("name").ignoreCase()));
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


    public User create(CreateUserDTO userDTO, Long organizationId){
        User user = userDTO.parseToUser(new User());
        if(organizationId!=null) {
            List<Organization> organizations = new ArrayList<>();
            Organization organization = new Organization();
            organization.setId(organizationId);
            organizations.add(organization);
            user.setOrganizations(organizations);
        }

        Optional<User> userWithEmail = this.userRepository.findByEmail(user.getEmail());

        if(userWithEmail.isPresent()){
            throw new UserException(UserExceptionsEnum.CONFLICT_USER_SAME_EMAIL);
        }

        user.setPassword(encoder.encode(user.getPassword()));
        user = this.userRepository.save(user);
        return user;
    }

    public User update(UUID id, CreateUserDTO userDTO){
        User user = userDTO.parseToUser(findById(id));

        Optional<User> userWithEmail = this.userRepository.findByEmail(user.getEmail());

        if(userWithEmail.isPresent() && !userWithEmail.get().getId().equals(id)){
            throw new UserException(UserExceptionsEnum.CONFLICT_USER_SAME_EMAIL);
        }

        user.setPassword(encoder.encode(user.getPassword()));
        user = this.userRepository.save(user);
        return user;
    }


    public void delete(UUID id) {
        findById(id);
        userRepository.deleteById(id);
    }

}
