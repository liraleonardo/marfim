package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.*;

import javax.validation.constraints.NotBlank;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class CreateRoleDTO {
    private Long id;
    @NotBlank(message="empty name")
    private String name;
    private String description;
    private Boolean isAdmin;

    public CreateRoleDTO(Role role) {
        id = role.getId();
        name = role.getName();
        description = role.getDescription();
        isAdmin = role.getIsAdmin();
    }

    public Role parseToRole(Role role) {
        description = description==null || description.isBlank() ? null : description.trim();

        role.setId(id);
        role.setName(name);
        role.setDescription(description);
        role.setIsAdmin(isAdmin);

        return role;
    }

}
