package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.RolePermission;
import org.ipdec.marfim.security.permission.RolePermissionLevelEnum;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class RoleLevelDTO {
    private Integer level;
    private String code;
    private String levelName;
    private String authority;

    public RoleLevelDTO(RolePermission rolePermission){
        this.level = rolePermission.getId().getLevel();
        this.code = RolePermissionLevelEnum.get(rolePermission.getId().getLevel()).getCode();
        this.levelName = RolePermissionLevelEnum.get(rolePermission.getId().getLevel()).getLevelName();
        this.authority = rolePermission.getAuthority();

    }
}
