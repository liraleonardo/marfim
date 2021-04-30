package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.Role;
import org.ipdec.marfim.api.model.RolePermission;

import java.util.List;
import java.util.Map;
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

        Map<Permission, List<RolePermission>> rolePermissionsGrouped = role.getRolePermissions().stream()
                .collect(Collectors.groupingBy(rolePermission -> rolePermission.getPermission()));
        rolePermissions = rolePermissionsGrouped.keySet().stream()
                .map(rolePermissionGrouped -> new RolePermissionDTO(rolePermissionGrouped, rolePermissionsGrouped.get(rolePermissionGrouped)))
                .collect(Collectors.toList());
    }

}
