package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.RolePermission;
import org.ipdec.marfim.security.permission.RolePermissionLevelEnum;

import java.util.List;
import java.util.stream.Collectors;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class RolePermissionDTO {
    private String name;
    private String code;
    private String description;
    private List<RoleLevelDTO> levels;

    public RolePermissionDTO(Permission permission, List<RolePermission> roleLevels) {
        name = permission.getName();
        code = permission.getCode();
        description = permission.getDescription();
        levels = roleLevels.stream().map(RoleLevelDTO::new).collect(Collectors.toList());

    }
}
