package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.ipdec.marfim.security.MarfimUserDetails;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthDTO {

    String token;
    MarfimUserDetails userDetails;

    public AuthDTO(String token, MarfimUserDetails userDetails) {
        this.token = token;
        this.userDetails = userDetails;
    }

    public AuthDTO(){

    }
}
