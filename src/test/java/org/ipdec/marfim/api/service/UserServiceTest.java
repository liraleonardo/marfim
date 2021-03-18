package org.ipdec.marfim.api.service;

import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static java.util.List.*;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    UserService userService;

    @BeforeEach
    void setup(){
        userService = new UserService(userRepository);
    }

    @Test
    @DisplayName("[Unit] It should list an empty list of users")
    void shouldReturnEmptyListOfUsers() {
        Mockito.when(userRepository.findAll()).thenReturn(new ArrayList<>());
        List<User> actualUsers = userService.findAll();
        assertThat(actualUsers).isEmpty();
    }

    @Test
    @DisplayName("[Unit] It should list all users")
    void shouldListAllUsers() {
        User user1 = new User(UUID.randomUUID(), "user1@email.com", "password", "user1", null, LocalDateTime.now(), LocalDateTime.now(), true,new ArrayList<>());
        User user2 = new User(UUID.randomUUID(), "user2@email.com", "password", "user2", null, LocalDateTime.now(), LocalDateTime.now(), true,new ArrayList<>());
        User user3 = new User(UUID.randomUUID(), "user3@email.com", "password", "user3", null, LocalDateTime.now(), LocalDateTime.now(), true,new ArrayList<>());
        List<User> expectedUsers = of(user1, user2, user3);
        Mockito.when(userRepository.findAll()).thenReturn(expectedUsers);
        List<User> actualUsers = userService.findAll();
        assertThat(actualUsers).isNotEmpty();
        assertThat(actualUsers.size()).isEqualTo(3);
        assertThat(actualUsers).usingRecursiveComparison().isEqualTo(expectedUsers);
    }

}