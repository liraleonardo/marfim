package org.ipdec.marfim.api.repository;

import org.ipdec.marfim.api.model.User;

import org.ipdec.marfim.util.AbstractDBTest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

//@SpringBootTest       // Os testes compartilham o mesmo contexto de aplicação inclusive o banco
@DataJpaTest            // Todos os testes viram transações que serão revertidas ao final
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest extends AbstractDBTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("[Unit] It should save a user with all entity information")
    public void shouldSaveAFullInfoUser(){
        User user = new User(null,"user@email.com","password","user name", "http://avatar.com/img123", LocalDateTime.now(),LocalDateTime.now(),true,false, new ArrayList<>(), new ArrayList<>());
        User savedUser = userRepository.save(user);
        assertThat(savedUser).usingRecursiveComparison().ignoringFields("id").isEqualTo(user);
        assertThat(savedUser.getId()).isNotNull();

        // checking if it was saved
        Optional<User> userFound = userRepository.findById(user.getId());
        assertThat(userFound).isNotEmpty().usingRecursiveComparison().isEqualTo(Optional.of(savedUser));
    }

    @Test
    @DisplayName("[Unit] It should save a user with name, email and password")
    @Disabled("This test fails if it is a DataJpaTest")
     public void shouldSaveABasicInfoUser(){
        User user = new User(null,"user@email.com","password","user name", null, null,null,null,null,null, null);
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

    @Test
    @DisplayName("[Unit] It should save a user with name, email and password")
    public void workingShouldSaveABasicInfoUser(){
        User user = new User(null,"user@email.com","password","user name", null, null,null,null,null,null, null);
        entityManager.persist(user);
        entityManager.flush();
        entityManager.detach(user); //sem o detach o findById vai retornar o objeto user que tá na sessão, e não carregar do banco

        Optional<User> userFound = userRepository.findById(user.getId());
        assertThat(userFound).isNotEmpty();
        assertThat(userFound.get().getCreatedAt()).isNotNull();
        assertThat(userFound.get().getUpdatedAt()).isNotNull();
        assertThat(userFound.get().getEnabled()).isTrue();
        assertThat(userFound.get().getRoles()).isEmpty();

    }
}
