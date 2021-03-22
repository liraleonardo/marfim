package org.ipdec.marfim.api.fake.controller;

import org.hamcrest.Matchers;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.util.AbstractDBTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;


import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class AuthorityCheckControllerIntTest extends AbstractDBTest{
    @Autowired
    private MockMvc mvc;

    @Test
    @DisplayName("[Unit] It should return success if user role is SUPER_USER")
    public void withRoleSuperUser_itShouldBeAllowedToAccessABlockedRoute() throws Exception {
        mvc.perform(get("/authority/check").with(user("user1@email.com").roles("SUPER_USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.containsString("success")));
    }

    @Test
    @DisplayName("[Unit] It should fail when user role is not valid or not SUPER_USER")
    public void withRoleUser_itShouldNotBeAllowedToAccessABlockedRoute() throws Exception {
        mvc.perform(get("/authority/check").with(user("user1@email.com").roles("USER")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message",Matchers.containsString("User does not have authorization to access this resource")));
    }

    @Test
    @DisplayName("[Unit] It should return success if user role is SUPER_USER")
    public void withAllowedRole_itShouldBeAllowedToAccessABlockedRoute() throws Exception {
        mvc.perform(get("/authority/check").with(user("user1@email.com").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.containsString("success")));
    }

    @Test
    @DisplayName("[Unit] It should return success if user role is SUPER_USER")
    public void withAllowedPermission_itShouldBeAllowedToAccessABlockedRoute() throws Exception {
        mvc.perform(get("/authority/check")
                    .with(user("user1@email.com")
                            .roles("USER")
                            .authorities(new Permission("READ_AUTHORITY_CHECK","A description"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.containsString("success")));
    }

}