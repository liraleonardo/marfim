package org.ipdec.marfim.api.repository;

import com.github.database.rider.core.api.dataset.DataSet;
import com.github.database.rider.core.api.dataset.ExpectedDataSet;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.util.AbstractDBTest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest       // Os testes compartilham o mesmo contexto de aplicação inclusive o banco
//@DataJpaTest            // Todos os testes viram transações que serão revertidas ao final
public class UserRepositoryIntTest extends AbstractDBTest {

    @Autowired
    private UserRepository userRepository;

    @AfterAll
    @DataSet("/dataset/user/emptyUsers.yml")
    public static void cleanUp() {
    }

    @Test
    @DisplayName("[Integration] It should save a user with all entity information")
    @DataSet("/dataset/user/emptyUsers.yml")
    @ExpectedDataSet("/dataset/user/oneUser.yml")
    public void shouldSaveAFullInfoUser(){
        User user = new User(null,"user@email.com","password","user name", "http://avatar.com/img123", LocalDateTime.now(),LocalDateTime.now(),true,new ArrayList<>());
        User savedUser = userRepository.save(user);
        assertThat(savedUser).usingRecursiveComparison().ignoringFields("id").isEqualTo(user);
        assertThat(savedUser.getId()).isNotNull();
    }

    @Test
    @DisplayName("[Integration] It should save a user with name, email and password")
    @DataSet("/dataset/user/emptyUsers.yml")
    @ExpectedDataSet("/dataset/user/oneUser.yml")
    public void shouldSaveABasicInfoUser(){
        User user = new User(null,"user@email.com","password","user name", null, null,null,null,null);
        User savedUser = userRepository.save(user);

        assertThat(savedUser).usingRecursiveComparison().ignoringActualNullFields().isEqualTo(user);
        assertThat(savedUser.getId()).isNotNull();

        Optional<User> userFound = userRepository.findById(user.getId());
        assertThat(userFound).isNotEmpty();
        assertThat(userFound.get().getCreatedAt()).isNotNull();
        assertThat(userFound.get().getUpdatedAt()).isNotNull();
        assertThat(userFound.get().getEnabled()).isTrue();
        assertThat(userFound.get().getRoles()).isEmpty();
    }


}
