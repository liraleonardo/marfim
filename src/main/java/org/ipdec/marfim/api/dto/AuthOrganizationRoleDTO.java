package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Role;
import org.ipdec.marfim.api.model.RolePermission;

import java.util.List;
import java.util.stream.Collectors;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class AuthOrganizationRoleDTO {
    private Long id;
    private String name;
    private String description;
    private List<String> permissions;
    private Boolean isAdmin;

    public AuthOrganizationRoleDTO(Role role) {
        id = role.getId();
        name = role.getName();
        description = role.getDescription();
        permissions = role.getRolePermissions().stream()
                .map(RolePermission::getAuthority)
                .collect(Collectors.toList());
        isAdmin = role.getIsAdmin();
    }
}
