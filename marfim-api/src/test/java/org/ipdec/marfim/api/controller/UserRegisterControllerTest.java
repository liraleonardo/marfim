package org.ipdec.marfim.api.controller;

import com.google.gson.Gson;
import org.hamcrest.Matchers;
import org.ipdec.marfim.api.dto.CreateUserDTO;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.ipdec.marfim.api.service.UserRegisterService;
import org.ipdec.marfim.config.properties.OAuthProperties;
import org.ipdec.marfim.security.MarfimUserDetailsService;
import org.ipdec.marfim.security.auth.AuthenticationExceptionEntryPoint;
import org.ipdec.marfim.security.auth.google.GoogleJWTToken;
import org.ipdec.marfim.security.auth.marfim.MarfimJWTToken;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = UserRegisterController.class)
@Import({AuthenticationExceptionEntryPoint.class,
        GoogleJWTToken.class,
        OAuthProperties.class,
        MarfimUserDetailsService.class,
        MarfimJWTToken.class,
})
public class UserRegisterControllerTest {
    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserRegisterService service;

    @MockBean
    private UserRepository repository;

    @Test
    @DisplayName("[Unit] It should register an user on route /user/register")
    public void itShouldRegisterAnUserSuccessfully() throws Exception {
        CreateUserDTO createUser = new CreateUserDTO("user@email.com", "password", "user name");
        User createdUser = new User(UUID.randomUUID(), createUser.getEmail(), createUser.getPassword(), createUser.getName(), null, LocalDateTime.now(), LocalDateTime.now(), true,new ArrayList<>());
        Mockito.when(service.register(createUser)).thenReturn(createdUser);

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", Matchers.notNullValue()))
                .andExpect(jsonPath("$.email", Matchers.is("user@email.com")))
                .andExpect(jsonPath("$.name", Matchers.is("user name")))
                .andExpect((jsonPath("$.password").doesNotExist()));
    }

    @Test
    @DisplayName("[Unit] It should return an error on route /user/register with empty content")
    public void itShouldNotRegisterAnUserWithEmptyBody() throws Exception {

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("Required request body is missing")));

    }

    @Test
    @DisplayName("[Unit] It should return an error on route /user/register with empty password")
    public void itShouldNotRegisterAnUserWithEmptyPassword() throws Exception {
        CreateUserDTO createUser = new CreateUserDTO("user@email.com", "password", "user name");
        createUser.setPassword(null);

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("empty password")));

    }

    @Test
    @DisplayName("[Unit] It should return an error on route /user/register with small password")
    public void itShouldNotRegisterAnUserWithSmallPassword() throws Exception {
        CreateUserDTO createUser = new CreateUserDTO("user@email.com", "pass", "user name");

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("password has less than 6 characters")));

    }

    @Test
    @DisplayName("[Unit] It should return an error on route /user/register with empty email")
    public void itShouldNotRegisterAnUserWithEmptyEmail() throws Exception {
        CreateUserDTO createUser = new CreateUserDTO("user@email.com", "password", "user name");
        createUser.setEmail(null);

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("empty email")));

    }

    @Test
    @DisplayName("[Unit] It should return an error on route /user/register with invalid email")
    public void itShouldNotRegisterAnUserWithInvalidEmail() throws Exception {
        CreateUserDTO createUser = new CreateUserDTO("useremail.com", "password", "user name");

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("invalid email format")));

    }

    @Test
    @DisplayName("[Unit] It should return an error on route /user/register with empty name")
    public void itShouldNotRegisterAnUserWithEmptyName() throws Exception {
        CreateUserDTO createUser = new CreateUserDTO("user@email.com", "password", "user name");
        createUser.setName(null);

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("empty name")));

    }




}