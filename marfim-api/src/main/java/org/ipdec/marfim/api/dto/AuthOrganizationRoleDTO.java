package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Role;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class AuthOrganizationRoleDTO {
    private Long id;
    private String name;
    private String description;

    public AuthOrganizationRoleDTO(Role role) {
        id = role.getId();
        name = role.getName();
        description = role.getDescription();
    }
}
