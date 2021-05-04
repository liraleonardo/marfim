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
public class PermissionLevelDTO {
    private String levelcode;
    private String levelName;
    private String authority;

    public PermissionLevelDTO(Permission permission) {
        this.levelcode = permission.getPermissionLevel().getCode();
        this.levelName = permission.getPermissionLevel().getName();
        this.authority = permission.getAuthority();
    }
}
