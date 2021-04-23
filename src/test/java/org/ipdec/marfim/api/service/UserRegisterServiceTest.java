package org.ipdec.marfim.api.service;

import org.ipdec.marfim.api.dto.RegisterUserDTO;
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
        RegisterUserDTO registerUserDTO = new RegisterUserDTO("email@email.com","password", "user name");

        // return empty because it is a new email
        Mockito.when(userRepository.findByEmail(registerUserDTO.getEmail())).thenReturn(Optional.empty());
        // return an encoded password to be saved
        Mockito.when(encoder.encode(registerUserDTO.getPassword())).thenReturn("encodedpassword");

        // user to be saved
        User userToBeSaved = new User();
        userToBeSaved.setEmail(registerUserDTO.getEmail());
        userToBeSaved.setPassword("encodedpassword");
        userToBeSaved.setName(registerUserDTO.getName());

        // user saved
        User userSaved = new User();
        userSaved.setId(UUID.randomUUID());
        userSaved.setEmail(registerUserDTO.getEmail());
        userSaved.setPassword("encodedpassword");
        userSaved.setName(registerUserDTO.getName());
        userSaved.setEnabled(true);
        userSaved.setCreatedAt(LocalDateTime.now());
        userSaved.setUpdatedAt(LocalDateTime.now());
        userSaved.setRoles(new ArrayList<>());

        // mock the return of save
        Mockito.when(userRepository.save(userToBeSaved)).thenReturn(userSaved);

        User createdUser = userRegisterService.register(registerUserDTO);

        assertNotNull(createdUser.getId());
        assertEquals(registerUserDTO.getEmail(),createdUser.getEmail());
        assertEquals(registerUserDTO.getName(),createdUser.getName());
        assertEquals("encodedpassword",createdUser.getPassword());

    }

    @Test
    @DisplayName("[Unit] It should register a new user account 2")
    void shouldRegisterANewUser2() {
        RegisterUserDTO registerUserDTO = new RegisterUserDTO("email@email.com","password", "user name");

        // return empty because it is a new email
        Mockito.when(userRepository.findByEmail(registerUserDTO.getEmail())).thenReturn(Optional.empty());
        // return an encoded password to be saved
        Mockito.when(encoder.encode(registerUserDTO.getPassword())).thenReturn("encodedpassword");

        userRegisterService.register(registerUserDTO);

        Mockito.verify(userRepository,Mockito.times(1)).save(ArgumentMatchers.any(User.class));
        Mockito.verify(userRepository,Mockito.times(1)).save(userArgumentCaptor.capture());

        assertEquals(registerUserDTO.getEmail(),userArgumentCaptor.getValue().getEmail());
        assertEquals(registerUserDTO.getName(),userArgumentCaptor.getValue().getName());
        assertEquals("encodedpassword",userArgumentCaptor.getValue().getPassword());

    }

    @Test
    @DisplayName("[Unit] It should not register a new user account with already registered email")
    void shouldNotRegisterANewUserWithExistingEmail() {
        RegisterUserDTO registerUserDTO = new RegisterUserDTO("email@email.com","password", "user name");
        User userFound = new User(UUID.randomUUID(), "email@email.com", "encodedpassword", "user name", null, LocalDateTime.now(), LocalDateTime.now(), true, false, new ArrayList<>(),new ArrayList<>());

        // return empty because it is a new email
        Mockito.when(userRepository.findByEmail(registerUserDTO.getEmail())).thenReturn(Optional.of(userFound));

        // FORMA 01
//        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
//            userRegisterService.register(createUserDTO);
//        });
//        assertThat(exception.getMessage().contains("user already registered")).isTrue();

        // FORMA 02
        assertThatThrownBy(() -> {
            userRegisterService.register(registerUserDTO);
        }).isInstanceOf(ResponseStatusException.class).hasMessageContaining("user already registered");

    }
}