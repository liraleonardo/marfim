package org.ipdec.marfim.api.dto;

import lombok.Data;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotBlank;

@Data
@Validated
public class LoginGoogleDTO {
    @NotBlank(message="empty token")
    String token;

}
