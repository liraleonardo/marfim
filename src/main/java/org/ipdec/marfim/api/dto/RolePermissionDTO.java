package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.RolePermission;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class RolePermissionDTO {
    private String name;
    private String code;
    private String description;
    private Integer level;
    private String authority;


    public RolePermissionDTO(RolePermission rolePermission){
        code = rolePermission.getPermission().getCode();
        name = rolePermission.getPermission().getName();
        description = rolePermission.getPermission().getDescription();
        this.level = rolePermission.getId().getLevel();
        this.authority = rolePermission.getAuthority();


    }
}
