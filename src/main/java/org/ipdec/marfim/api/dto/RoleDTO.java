package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.PermissionResource;
import org.ipdec.marfim.api.model.Role;

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
    private List<PermissionGroupedByResourceDTO> permissions;

    public RoleDTO(Role role) {
        id = role.getId();
        name = role.getName();
        description = role.getDescription();
        isAdmin = role.getIsAdmin();
        organization = new OrganizationDTO(role.getOrganization());
        Map<PermissionResource, List<Permission>> groupedPermissions = role.getPermissions().stream()
                .collect(Collectors.groupingBy(permission -> permission.getPermissionResource()));

        permissions = groupedPermissions.keySet().stream()
                .map(permissionResource -> new PermissionGroupedByResourceDTO(permissionResource, groupedPermissions.get(permissionResource)))
                .collect(Collectors.toList());
    }

}
