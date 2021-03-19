package org.ipdec.marfim.api.service;

import com.github.database.rider.core.api.dataset.DataSet;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.util.AbstractDBTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserServiceIntTest extends AbstractDBTest {
    @Autowired
    UserService userService;

    @Test
    @DataSet("dataset/user/emptyUsers.yml")
    @DisplayName("[Unit] It should list an empty list of users")
    void shouldReturnEmptyListOfUsers() {
        List<User> actualUsers = userService.findAll();
        assertThat(actualUsers).isEmpty();
    }

    @Test
    @DisplayName("[Unit] It should list all enabled users")
    @DataSet("dataset/user/someUsers.yml")
    void shouldListAllUsers() {
        List<User> actualUsers = userService.findAll();
        assertThat(actualUsers).isNotEmpty();
        assertThat(actualUsers.size()).isEqualTo(3);
        assertThat(actualUsers).map(User::getEmail).isEqualTo(List.of("user1@email.com","user2@email.com","user3@email.com"));
    }

}