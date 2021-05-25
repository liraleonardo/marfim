package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.UserDTO;
import org.ipdec.marfim.api.exception.OrganizationException;
import org.ipdec.marfim.api.exception.UserException;
import org.ipdec.marfim.api.exception.type.OrganizationExceptionsEnum;
import org.ipdec.marfim.api.exception.type.UserExceptionsEnum;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.OrganizationRepository;
import org.ipdec.marfim.api.repository.UserRepository;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class OrganizationUserService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final OrganizationRepository organizationRepository;

    public UserDTO findUserDTOByEmail(String email, Long organizationId) {
        User user = userRepository.findByEmail(email).orElseThrow(()->{
            return new UserException(UserExceptionsEnum.NOT_FOUND);
        });

        return new UserDTO(user);
    }

    public void linkUserWithOrganization(UUID userId, Long organizationId) {
        if(organizationId == null){
            throw new UserException(UserExceptionsEnum.FORBIDDEN_WITHOUT_TENANCY);
        }
        User userFound = userRepository.findById(userId)
                .orElseThrow(()-> new UserException(UserExceptionsEnum.NOT_FOUND));
        Organization organizationFound = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new OrganizationException(OrganizationExceptionsEnum.NOT_FOUND));

        if(userFound.isSuper()) {
            throw new UserException(UserExceptionsEnum.FORBIDDEN_UPDATE_SUPER_USER_BY_NON_SUPER_USER);
        }

        if(userFound.getOrganizations().stream().anyMatch(organization -> Objects.equals(organization.getId(), organizationId))){
            throw new UserException(UserExceptionsEnum.BAD_REQUEST_USER_ALREADY_LINKED);
        }

        Collection<Organization> organizations = userFound.getOrganizations();
        organizations.add(organizationFound);
        userFound.setOrganizations(organizations);
        userRepository.save(userFound);
    }

    public List<UserDTO> findAllUsersDTO(Long organizationId, Optional<String> userName) {
        User userFilter = new User();
        userFilter.setName(userName.orElse(""));
        ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll()
                .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
                .withIgnoreNullValues();

        Example<User> userExample = Example.of(userFilter, exampleMatcher);

        return userService.findAll(organizationId, userExample).stream().map(UserDTO::new)
                .collect(Collectors.toList());
    }
}
