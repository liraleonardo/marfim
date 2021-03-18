package org.ipdec.marfim.api.service;

import com.github.database.rider.core.api.dataset.DataSet;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.util.AbstractDBTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
public class UserServiceIntTest extends AbstractDBTest {
    @Autowired
    UserService userService;

    @Test
    @DisplayName("[Unit] It should return access denied exception")
    @WithMockUser
    void withRoleUser_shouldDenyAccessForFindAllUsers() {
        assertThatThrownBy(()->{
            userService.findAll();
        }).isInstanceOf(AccessDeniedException.class).hasMessageContaining("Access is denied");
    }

    @Test
    @DataSet("dataset/user/emptyUsers.yml")
    @DisplayName("[Unit] It should list an empty list of users")
    @WithMockUser(roles = { "ADMIN"})
    void withRoleAdmin_shouldReturnEmptyListOfUsers() {
        List<User> actualUsers = userService.findAll();
        assertThat(actualUsers).isEmpty();
    }

    @Test
    @DisplayName("[Unit] It should list all users")
    @DataSet("dataset/user/someUsers.yml")
    @WithMockUser(roles = { "ADMIN"})
    void withRoleAdmin_shouldListAllUsers() {
        List<User> actualUsers = userService.findAll();
        assertThat(actualUsers).isNotEmpty();
        assertThat(actualUsers.size()).isEqualTo(3);
        assertThat(actualUsers).map(User::getEmail).isEqualTo(List.of("user1@email.com","user2@email.com","user3@email.com"));
    }

    @Test
    @DisplayName("[Unit] It should list all users")
    @DataSet("dataset/user/someUsers.yml")
    @WithMockUser(authorities = { "READ_USERS"})
    void withAuthorityReadUsers_shouldListAllUsers() {
        List<User> actualUsers = userService.findAll();
        assertThat(actualUsers).isNotEmpty();
        assertThat(actualUsers.size()).isEqualTo(3);
        assertThat(actualUsers).map(User::getEmail).isEqualTo(List.of("user1@email.com","user2@email.com","user3@email.com"));
    }

    @Test
    @DisplayName("[Unit] It should list all users")
    @DataSet("dataset/user/someUsers.yml")
    @WithMockUser(authorities = { "READ_PROJECTS"})
    void withInvalidAuthority_shouldNotListAllUsers() {
        assertThatThrownBy(()->{
            userService.findAll();
        }).isInstanceOf(AccessDeniedException.class).hasMessageContaining("Access is denied");
    }

}