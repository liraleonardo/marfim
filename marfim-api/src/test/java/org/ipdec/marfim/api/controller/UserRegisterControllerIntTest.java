package org.ipdec.marfim.api.controller;

import com.github.database.rider.core.api.dataset.DataSet;
import com.google.gson.Gson;
import org.hamcrest.Matchers;
import org.ipdec.marfim.api.dto.RegisterUserDTO;
import org.ipdec.marfim.util.AbstractDBTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class UserRegisterControllerIntTest extends AbstractDBTest {
    @Autowired
    private MockMvc mvc;

    @LocalServerPort
	private int port;

    @Test
    @DisplayName("[Integration] It should register an user on route /user/register")
    public void itShouldRegisterAnUserSuccessfully() throws Exception {
        RegisterUserDTO createUser = new RegisterUserDTO("user@email.com", "password", "user name");

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
    @DisplayName("[Integration] It should return an error on route /user/register with empty content")
    public void itShouldNotRegisterAnUserWithEmptyBody() throws Exception {

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("Required request body is missing")));

    }

    @Test
    @DisplayName("[Integration] It should return an error on route /user/register with empty password")
    public void itShouldNotRegisterAnUserWithEmptyPassword() throws Exception {
        RegisterUserDTO createUser = new RegisterUserDTO("user@email.com", "password", "user name");
        createUser.setPassword(null);

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("empty password")));

    }

    @Test
    @DisplayName("[Integration] It should return an error on route /user/register with small password")
    public void itShouldNotRegisterAnUserWithSmallPassword() throws Exception {
        RegisterUserDTO createUser = new RegisterUserDTO("user@email.com", "pass", "user name");

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("password has less than 6 characters")));

    }

    @Test
    @DisplayName("[Integration] It should return an error on route /user/register with empty email")
    public void itShouldNotRegisterAnUserWithEmptyEmail() throws Exception {
        RegisterUserDTO createUser = new RegisterUserDTO("user@email.com", "password", "user name");
        createUser.setEmail(null);

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("empty email")));

    }

    @Test
    @DisplayName("[Integration] It should return an error on route /user/register with invalid email")
    public void itShouldNotRegisterAnUserWithInvalidEmail() throws Exception {
        RegisterUserDTO createUser = new RegisterUserDTO("useremail.com", "password", "user name");

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("invalid email format")));

    }

    @Test
    @DisplayName("[Integration] It should return an error on route /user/register with empty name")
    public void itShouldNotRegisterAnUserWithEmptyName() throws Exception {
        RegisterUserDTO createUser = new RegisterUserDTO("user@email.com", "password", "user name");
        createUser.setName(null);

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message",Matchers.containsString("empty name")));

    }

    @Test
    @DisplayName("[Integration] It should return an error on route /user/register when user email already registered")
    @DataSet("/dataset/user/oneUser.yml")
    public void itShouldNotRegisterADuplicateUser() throws Exception {
        RegisterUserDTO createUser = new RegisterUserDTO("user@email.com", "password", "user name");

        mvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(createUser)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", Matchers.containsString("user already registered")));

    }




}