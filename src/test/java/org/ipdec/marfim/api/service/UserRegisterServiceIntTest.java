package org.ipdec.marfim.api.service;

import com.github.database.rider.core.api.dataset.DataSet;
import org.ipdec.marfim.api.dto.RegisterUserDTO;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.util.AbstractDBTest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserRegisterServiceIntTest extends AbstractDBTest {

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    UserRegisterService userRegisterService;

    @AfterAll
    @DataSet("/dataset/user/emptyUsers.yml")
    public static void cleanUp() {
    }

    @Test
    @DisplayName("[Integration] It should register a new user account")
    @DataSet("/dataset/user/emptyUsers.yml")
    void shouldRegisterANewUser() {
        RegisterUserDTO registerUserDTO = new RegisterUserDTO("user@email.com","password", "user name");

        User createdUser = userRegisterService.register(registerUserDTO);

        assertNotNull(createdUser.getId());
        assertEquals(registerUserDTO.getEmail(),createdUser.getEmail());
        assertEquals(registerUserDTO.getName(),createdUser.getName());
        assertTrue(encoder.matches(registerUserDTO.getPassword(),createdUser.getPassword()));
    }


    @Test
    @DisplayName("[Integration] It should not register a new user account with already registered email")
    @DataSet("/dataset/user/oneUser.yml")
    void shouldNotRegisterANewUserWithExistingEmail() {
        RegisterUserDTO registerUserDTO = new RegisterUserDTO("user@email.com","password", "user name");

        assertThatThrownBy(() -> {
            userRegisterService.register(registerUserDTO);
        }).isInstanceOf(ResponseStatusException.class).hasMessageContaining("user already registered");

    }
}