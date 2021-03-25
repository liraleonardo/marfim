package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.User;

import java.util.UUID;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class AuthUserDTO {
    private UUID id;
    private String email;
    private String name;
    private String avatarUrl;
    private Boolean enabled;
    private Boolean isSuper;

    public AuthUserDTO(User user) {
        id = user.getId();
        email = user.getEmail();
        name = user.getName();
        avatarUrl = user.getAvatarUrl();
        enabled = user.getEnabled();
        isSuper = user.getIsSuper();
    }
}
