package org.ipdec.marfim.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.assertj.core.api.Assertions;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.ipdec.marfim.api.service.UserService;
import org.ipdec.marfim.config.properties.OAuthProperties;
import org.ipdec.marfim.security.MarfimUserDetailsService;
import org.ipdec.marfim.security.auth.AuthenticationExceptionEntryPoint;
import org.ipdec.marfim.security.auth.google.GoogleJWTToken;
import org.ipdec.marfim.security.auth.marfim.MarfimJWTToken;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = UserController.class)
@ExtendWith(MockitoExtension.class)
@Import({AuthenticationExceptionEntryPoint.class,
        GoogleJWTToken.class,
        OAuthProperties.class,
        MarfimUserDetailsService.class,
        MarfimJWTToken.class,
})
public class UserControllerTest {
    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserService service;

    @MockBean
    private UserRepository repository;

    @Autowired
    private ObjectMapper mapper;


//    This Unit Test can not check the user role because of: https://stackoverflow.com/questions/32442408/preauthorize-not-working-on-controller/32443631
    @Test
    @DisplayName("[Unit] It should list all users successfully without passwords")
    public void itShouldListAllUsersSuccessfullyWithoutPasswords() throws Exception {
        User user1 = new User(UUID.randomUUID(), "user1@email.com", "password", "user1", null, LocalDateTime.now(), LocalDateTime.now(), true, false, new ArrayList<>());
        User user2 = new User(UUID.randomUUID(), "user2@email.com", "password", "user2", null, LocalDateTime.now(), LocalDateTime.now(), true, false, new ArrayList<>());
        User user3 = new User(UUID.randomUUID(), "user3@email.com", "password", "user3", null, LocalDateTime.now(), LocalDateTime.now(), true, false, new ArrayList<>());
        List<User> expectedUsers = List.of(user1,user2,user3);
        Mockito.when(service.findAll()).thenReturn(expectedUsers);

        String allUsersStr = mvc.perform(get("/user").with(user("user1@email.com")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        List<Object> usersObjects = jsonParser.parseList(allUsersStr);

        List<User> users = usersObjects.stream().map(object -> mapper.convertValue(object, User.class)).collect(Collectors.toList());
        Assertions.assertThat(users).usingRecursiveComparison().ignoringFields("password", "roles").isEqualTo(expectedUsers);
        Assertions.assertThat(users).allMatch(user -> user.getPassword() == null);
    }

}