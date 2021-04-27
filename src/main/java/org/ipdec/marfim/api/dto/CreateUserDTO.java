package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.model.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateUserDTO {
    @NotBlank(message="empty email")
    @Email(message = "invalid email format")
    private String email;

    @NotBlank(message="empty password")
    @Size(min=6, message = "password has less than 6 characters")
    private String password;

    @NotBlank(message="empty name")
    private String name;

    private Boolean isSuper;

    public User parseToUser(User user){
        user.setEmail(email.trim().toLowerCase()
                .replaceAll("\\s", "")
                .replaceAll("\\t", ""));
        user.setName(name);
        user.setPassword(password);
        user.setIsSuper(isSuper);
        return user;
    }
}
