package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.User;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private UUID id;
    private String email;
    private String name;
    private String avatarUrl;
    private Boolean isSuper;
    private List<OrganizationDTO> organizations;


    public UserDTO(User user) {
        id = user.getId();
        email = user.getEmail();
        name = user.getName();
        avatarUrl = user.getAvatarUrl();
        isSuper = user.getIsSuper();
        if(user.getOrganizations()!=null)
            organizations = user.getOrganizations().stream().map(OrganizationDTO::new).collect(Collectors.toList());
    }

}
