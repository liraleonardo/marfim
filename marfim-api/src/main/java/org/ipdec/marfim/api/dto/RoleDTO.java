package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.*;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class RoleDTO {
    private Long id;
    private String name;
    private String description;
    private Boolean isAdmin;
    private OrganizationDTO organization;
    private Integer permissionsNumber;
    private Integer usersNumber;

    public RoleDTO(Role role) {
        id = role.getId();
        name = role.getName();
        description = role.getDescription();
        isAdmin = role.getIsAdmin();
        organization = new OrganizationDTO(role.getOrganization());
        permissionsNumber = role.getPermissions()!=null && !role.getIsAdmin() ? role.getPermissions().size() : null;
        usersNumber = role.getUsers()!=null ? role.getUsers().size() : null;
    }

}
