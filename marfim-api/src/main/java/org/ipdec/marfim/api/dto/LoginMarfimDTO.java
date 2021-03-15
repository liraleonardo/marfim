package org.ipdec.marfim.api.dto;

import lombok.Data;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
@Validated
public class LoginMarfimDTO {
    @Email(message="invalid email format")
    @NotBlank(message="empty email")
    String email;

    @NotBlank(message="empty password")
    String password;
}
