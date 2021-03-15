package org.ipdec.marfim.api.service;

import com.github.database.rider.core.api.dataset.DataSet;
import com.github.database.rider.core.api.dataset.ExpectedDataSet;
import com.github.database.rider.junit5.api.DBRider;
import org.ipdec.marfim.api.dto.CreateUserDTO;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.ipdec.marfim.util.AbstractDBTest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@DBRider
public class AnotherUserRegisterServiceTest extends AbstractDBTest {

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
        CreateUserDTO createUserDTO = new CreateUserDTO("user@email.com","password", "user name");

        User createdUser = userRegisterService.register(createUserDTO);

        assertNotNull(createdUser.getId());
        assertEquals(createUserDTO.getEmail(),createdUser.getEmail());
        assertEquals(createUserDTO.getName(),createdUser.getName());
        assertTrue(encoder.matches(createUserDTO.getPassword(),createdUser.getPassword()));
    }


    @Test
    @DisplayName("[Integration] It should not register a new user account with already registered email")
    @DataSet("/dataset/user/oneUser.yml")
    void shouldNotRegisterANewUserWithExistingEmail() {
        CreateUserDTO createUserDTO = new CreateUserDTO("user@email.com","password", "user name");

        assertThatThrownBy(() -> {
            userRegisterService.register(createUserDTO);
        }).isInstanceOf(ResponseStatusException.class).hasMessageContaining("user already registered");

    }
}