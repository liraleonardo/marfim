package org.ipdec.marfim.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUserDTO {
    @NotBlank(message="empty email")
    @Email(message = "invalid email format")
    private String email;

    @NotBlank(message="empty password")
    @Size(min=6, message = "password has less than 6 characters")
    private String password;

    @NotBlank(message="empty name")
    private String name;

 }
