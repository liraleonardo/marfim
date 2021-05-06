package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Permission;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class PermissionDTO {
    private String levelCode;
    private String levelName;
    private String resourceCode;
    private String resourceName;
    private String authority;

    public PermissionDTO(Permission permission) {
        this.levelCode = permission.getPermissionLevel().getCode();
        this.levelName = permission.getPermissionLevel().getName();
        this.resourceCode = permission.getPermissionResource().getCode();
        this.resourceName = permission.getPermissionResource().getName();
        authority = permission.getAuthority();
    }
}
