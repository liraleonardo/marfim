package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.PermissionResource;

import java.util.List;
import java.util.stream.Collectors;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class PermissionGroupedByResourceDTO {
    private String resourceCode;
    private String resourceName;
    private List<PermissionLevelDTO> levels;

    public PermissionGroupedByResourceDTO(PermissionResource permissionResource, List<Permission> permissions) {
        resourceCode = permissionResource.getCode();
        resourceName = permissionResource.getName();
        levels = permissions.stream().map(PermissionLevelDTO::new).collect(Collectors.toList());
    }
}
