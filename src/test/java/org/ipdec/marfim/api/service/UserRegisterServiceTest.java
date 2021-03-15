package org.ipdec.marfim.api.service;

import org.ipdec.marfim.api.dto.CreateUserDTO;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserRegisterServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder encoder;
    @Captor
    ArgumentCaptor<User> userArgumentCaptor;

    UserRegisterService userRegisterService;

    @BeforeEach
    void setup(){
        userRegisterService = new UserRegisterService(userRepository, encoder);
    }

    @Test
    @DisplayName("[Unit] It should register a new user account")
    void shouldRegisterANewUser() {
        CreateUserDTO createUserDTO = new CreateUserDTO("email@email.com","password", "user name");

        // return empty because it is a new email
        Mockito.when(userRepository.findByEmail(createUserDTO.getEmail())).thenReturn(Optional.empty());
        // return an encoded password to be saved
        Mockito.when(encoder.encode(createUserDTO.getPassword())).thenReturn("encodedpassword");

        // user to be saved
        User userToBeSaved = new User();
        userToBeSaved.setEmail(createUserDTO.getEmail());
        userToBeSaved.setPassword("encodedpassword");
        userToBeSaved.setName(createUserDTO.getName());

        // user saved
        User userSaved = new User();
        userSaved.setId(UUID.randomUUID());
        userSaved.setEmail(createUserDTO.getEmail());
        userSaved.setPassword("encodedpassword");
        userSaved.setName(createUserDTO.getName());
        userSaved.setEnabled(true);
        userSaved.setCreatedAt(LocalDateTime.now());
        userSaved.setUpdatedAt(LocalDateTime.now());
        userSaved.setRoles(new ArrayList<>());

        // mock the return of save
        Mockito.when(userRepository.save(userToBeSaved)).thenReturn(userSaved);

        User createdUser = userRegisterService.register(createUserDTO);

        assertNotNull(createdUser.getId());
        assertEquals(createUserDTO.getEmail(),createdUser.getEmail());
        assertEquals(createUserDTO.getName(),createdUser.getName());
        assertEquals("encodedpassword",createdUser.getPassword());

    }

    @Test
    @DisplayName("[Unit] It should register a new user account 2")
    void shouldRegisterANewUser2() {
        CreateUserDTO createUserDTO = new CreateUserDTO("email@email.com","password", "user name");

        // return empty because it is a new email
        Mockito.when(userRepository.findByEmail(createUserDTO.getEmail())).thenReturn(Optional.empty());
        // return an encoded password to be saved
        Mockito.when(encoder.encode(createUserDTO.getPassword())).thenReturn("encodedpassword");

        userRegisterService.register(createUserDTO);

        Mockito.verify(userRepository,Mockito.times(1)).save(ArgumentMatchers.any(User.class));
        Mockito.verify(userRepository,Mockito.times(1)).save(userArgumentCaptor.capture());

        assertEquals(createUserDTO.getEmail(),userArgumentCaptor.getValue().getEmail());
        assertEquals(createUserDTO.getName(),userArgumentCaptor.getValue().getName());
        assertEquals("encodedpassword",userArgumentCaptor.getValue().getPassword());

    }

    @Test
    @DisplayName("[Unit] It should not register a new user account with already registered email")
    void shouldNotRegisterANewUserWithExistingEmail() {
        CreateUserDTO createUserDTO = new CreateUserDTO("email@email.com","password", "user name");
        User userFound = new User(UUID.randomUUID(), "email@email.com", "encodedpassword", "user name", null, LocalDateTime.now(), LocalDateTime.now(), true, new ArrayList<>());

        // return empty because it is a new email
        Mockito.when(userRepository.findByEmail(createUserDTO.getEmail())).thenReturn(Optional.of(userFound));

        // FORMA 01
//        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
//            userRegisterService.register(createUserDTO);
//        });
//        assertThat(exception.getMessage().contains("user already registered")).isTrue();

        // FORMA 02
        assertThatThrownBy(() -> {
            userRegisterService.register(createUserDTO);
        }).isInstanceOf(ResponseStatusException.class).hasMessageContaining("user already registered");

    }
}