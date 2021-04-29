package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Role;

import java.util.List;
import java.util.stream.Collectors;

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
    private List<RolePermissionDTO> rolePermissions;

    public RoleDTO(Role role) {
        id = role.getId();
        name = role.getName();
        description = role.getDescription();
        isAdmin = role.getIsAdmin();
        organization = new OrganizationDTO(role.getOrganization());
        rolePermissions = role.getRolePermissions().stream()
                .map(rolePermission -> new RolePermissionDTO(rolePermission))
                .collect(Collectors.toList());
    }

}
