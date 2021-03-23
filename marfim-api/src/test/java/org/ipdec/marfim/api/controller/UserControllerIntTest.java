package org.ipdec.marfim.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.database.rider.core.api.dataset.DataSet;
import com.google.gson.Gson;
import org.hamcrest.Matchers;
import org.ipdec.marfim.api.dto.LoginMarfimDTO;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.Role;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.ipdec.marfim.util.AbstractDBTest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class UserControllerIntTest extends AbstractDBTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    @MockBean
    private PasswordEncoder encoder;

    @Autowired
    private UserRepository userRepository;

    private String getUserToken(String email, String password) throws Exception {
        LoginMarfimDTO dto = new LoginMarfimDTO(email,password);
        String responseStr = mvc.perform(post("/login/marfim")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new Gson().toJson(dto)))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        return jsonParser.parseMap(responseStr).get("token").toString();
    }

    @Test
    @DisplayName("[Unit] It should list all users if requester has role admin")
    @DataSet(value = {"/dataset/user/someUsers.yml"})
    public void itShouldListAllUsers() throws Exception {
        Mockito.when(encoder.matches("password","password")).thenReturn(true);
        // setting manually user role relationship
        User user1 = userRepository.findByEmail("user1@email.com").get();
        Role roleAdmin = new Role();
        roleAdmin.setId(1L);
        user1.setRoles(List.of(roleAdmin));
        userRepository.save(user1);

        // first will obtain an user token, and then perform the GET on route /user/ with Authorization Header
        String responseStr = mvc.perform(get("/user").header("Authorization", String.format("Bearer %s", getUserToken("user1@email.com", "password"))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        List<Object> objects = jsonParser.parseList(responseStr);
        assertThat(objects.size()).isEqualTo(3);
        assertThat(objects).map(object -> {
            return mapper.convertValue(object,User.class).getEmail();
        }).isEqualTo(List.of("user1@email.com","user2@email.com","user3@email.com"));

    }

    @Test
    @DisplayName("[Unit] With role admin It should list all users")
    @DataSet(value = {"/dataset/user/someUsers.yml"})
    public void withRoleAdmin_itShouldListAllUsers() throws Exception {

        String responseStr = mvc.perform(get("/user").with(user("user1@email.com").roles("ADMIN")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        List<Object> objects = jsonParser.parseList(responseStr);
        assertThat(objects.size()).isEqualTo(3);
        assertThat(objects).map(object -> {
            return mapper.convertValue(object,User.class).getEmail();
        }).isEqualTo(List.of("user1@email.com","user2@email.com","user3@email.com"));

    }

    @Test
    @DisplayName("[Unit] With forbidden role It should not list all users")
    @DataSet(value = {"/dataset/user/someUsers.yml"})
    public void withoutRoleAdmin_itShouldNotListAllUsers() throws Exception {
        mvc.perform(get("/user").with(user("user1@email.com").roles("USER")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message",Matchers.containsString("User does not have authorization to access this resource")));
    }

    @Test
    @DisplayName("[Unit] Without authentication It should not list all users")
    @DataSet(value = {"/dataset/user/someUsers.yml"})
    public void withoutToken_itShouldNotListAllUsers() throws Exception {
        mvc.perform(get("/user"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message",Matchers.containsString("Full authentication is required to access this resource")));
    }


    @Test
    @DisplayName("[Unit] With READ_USERS permission It should list all users")
    @DataSet(value = {"/dataset/user/someUsers.yml"})
    public void withReadUsersPermission_itShouldListAllUsers() throws Exception {

        String responseStr = mvc.perform(get("/user").with(user("user1@email.com").roles("USER").authorities(new Permission("READ_USERS","Read Users","Read all users"))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        List<Object> objects = jsonParser.parseList(responseStr);
        assertThat(objects.size()).isEqualTo(3);
        assertThat(objects).map(object -> {
            return mapper.convertValue(object,User.class).getEmail();
        }).isEqualTo(List.of("user1@email.com","user2@email.com","user3@email.com"));

    }

    @Test
    @DisplayName("[Unit] With invalid permission It should not list all users")
    @DataSet(value = {"/dataset/user/someUsers.yml"})
    public void withInvalidPermission_itShouldNotListAllUsers() throws Exception {

        mvc.perform(get("/user").with(user("user1@email.com").roles("USER")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message",Matchers.containsString("User does not have authorization to access this resource")));

    }


    @Test
    @DisplayName("[Unit] With role SUPER_USER It should list all users")
    @DataSet(value = {"/dataset/user/someUsers.yml"})
    public void withRoleSuperUser_itShouldListAllUsers() throws Exception {

        String responseStr = mvc.perform(get("/user").with(user("user1@email.com").roles("SUPER_USER")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        List<Object> objects = jsonParser.parseList(responseStr);
        assertThat(objects.size()).isEqualTo(3);
        assertThat(objects).map(object -> {
            return mapper.convertValue(object,User.class).getEmail();
        }).isEqualTo(List.of("user1@email.com","user2@email.com","user3@email.com"));

    }

    @Test
    @DisplayName("[Unit] If User is super, It should list all users")
    @DataSet(value = {"/dataset/user/someUsers.yml"})
    public void withSuperUser_itShouldListAllUsers() throws Exception {
        Mockito.when(encoder.matches("password","password")).thenReturn(true);

        // first will obtain an user token, and then perform the GET on route /user/ with Authorization Header
        String token = getUserToken("user3@email.com", "password");

        String responseStr = mvc.perform(get("/user").header("Authorization", String.format("Bearer %s", token)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        List<Object> objects = jsonParser.parseList(responseStr);
        assertThat(objects.size()).isEqualTo(3);
        assertThat(objects).map(object -> {
            return mapper.convertValue(object,User.class).getEmail();
        }).isEqualTo(List.of("user1@email.com","user2@email.com","user3@email.com"));
    }




}