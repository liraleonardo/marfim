package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.UserDTO;
import org.ipdec.marfim.api.dto.CreateUserDTO;
import org.ipdec.marfim.api.dto.UpdateUserDTO;
import org.ipdec.marfim.api.exception.UserException;
import org.ipdec.marfim.api.exception.type.UserExceptionsEnum;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.ipdec.marfim.security.IPrincipalTokenAttributes;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder encoder;

    private final IPrincipalTokenAttributes principal;

    public User findById(UUID id, Long organizationId) {
        User user = userRepository.findById(id).orElseThrow(()->{
            return new UserException(UserExceptionsEnum.NOT_FOUND);
        });
        // should find an user only if it exist on current tenant
        if(organizationId!=null){
            boolean isUserFromTenantOrganization = user.getOrganizations().stream()
                    .anyMatch(organization -> Objects.equals(organization.getId(), organizationId));
            if(!isUserFromTenantOrganization){
                throw new UserException(UserExceptionsEnum.FORBIDDEN_USER_ORGANIZATION_DIFFERENT_FROM_TENANT);
            }
        }
        return user;
    }


    public List<User> findAll() {
        return userRepository.findAll(Sort.by(Sort.Order.asc("name").ignoreCase()));
    }

    public List<User> findAll(Long organizationId, Example<User> example) {
        List<User> allUsers = userRepository.findAll(example, Sort.by(Sort.Order.asc("name").ignoreCase()));
        if(organizationId==null) {
            return allUsers;
        }

        return allUsers.stream().filter(user -> {
            return user.getOrganizations().stream().anyMatch(userOrganization ->
                    userOrganization.getId().longValue() == organizationId);
        }).collect(Collectors.toList());

    }

    public List<UserDTO> findAllUsersDTO(Long organizationId, Optional<String> userName) {
        User userFilter = new User();
        userFilter.setName(userName.orElse(""));
        ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll()
                .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
                .withIgnoreNullValues();

        Example<User> userExample = Example.of(userFilter, exampleMatcher);

       return findAll(organizationId, userExample).stream().map(UserDTO::new)
                .collect(Collectors.toList());
    }


    public User create(CreateUserDTO userDTO, Long organizationId){
        User user = userDTO.parseToUser(new User());
        Boolean principalIsSuper = principal.getUser().isSuper();
        if(user.isSuper() && !principalIsSuper){
            throw new UserException(UserExceptionsEnum.FORBIDDEN_BECOME_SUPER_USER_BY_NON_SUPER_USER);
        }

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

    public User update(UUID id, UpdateUserDTO userDTO, Long tenantId){
        // should update an user only if it exist on current tenant
        User originalUser = findById(id, tenantId);
        Boolean principalIsSuper = principal.getUser().isSuper();

        // normal user should not update a super user
        if(originalUser.isSuper() && !principalIsSuper){
            throw new UserException(UserExceptionsEnum.FORBIDDEN_UPDATE_SUPER_USER_BY_NON_SUPER_USER);
        }

        // normal user should not update organizations (it will ignore)
        if(!principalIsSuper){
            userDTO.setOrganizations(null);
        }

        User user = userDTO.parseToUser(originalUser);

        // normal user should not grant super user privileges
        if(user.isSuper() && !principalIsSuper){
            throw new UserException(UserExceptionsEnum.FORBIDDEN_BECOME_SUPER_USER_BY_NON_SUPER_USER);
        }

        Optional<User> userWithEmail = this.userRepository.findByEmail(user.getEmail());

        // should not update email to another existing user email
        if(userWithEmail.isPresent() && !userWithEmail.get().getId().equals(id)){
            throw new UserException(UserExceptionsEnum.CONFLICT_USER_SAME_EMAIL);
        }

        // should update user password only if it is not null, empty, blank
        if(userDTO.getPassword()!=null
                && !userDTO.getPassword().isBlank()
                && !userDTO.getPassword().isEmpty()){
            user.setPassword(encoder.encode(user.getPassword()));
        }

        user = this.userRepository.save(user);
        return user;
    }


    public void delete(UUID id, Long tenantId) {
        // should delete an user only if it exist on current tenant
        User userToBeRemoved = findById(id, tenantId);
        Boolean principalIsSuper = principal.getUser().isSuper();

        // an user should not be able to delete a super user
        if(!principalIsSuper && userToBeRemoved.isSuper()){
            throw new UserException(UserExceptionsEnum.FORBIDDEN_UPDATE_SUPER_USER_BY_NON_SUPER_USER);
        }

        if(tenantId==null) {
            // a super user should delete any user
            userRepository.deleteById(id);
            return;
        }

        // an user should only remove the relationship with the current organization (tenantId)
        boolean wasOrganizationRemoved = userToBeRemoved.getOrganizations().removeIf(organization -> Objects.equals(organization.getId(), tenantId));
        boolean wasRoleRemoved = userToBeRemoved.getRoles().removeIf(role -> Objects.equals(role.getOrganization().getId(),tenantId));
        if(wasOrganizationRemoved || wasRoleRemoved){
            userRepository.save(userToBeRemoved);
        }
    }

}
