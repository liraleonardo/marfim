package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.security.permission.RolePermissionLevelEnum;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
public class PermissionGroupDTO {
    private String label;
    private List<PermissionDTO> permissions;

    public PermissionGroupDTO(String label, List<Permission> permissionsList) {
        this.label = label;
        this.permissions = permissionsList.stream().sorted(new Comparator<Permission>() {
            @Override
            public int compare(Permission o1, Permission o2) {
                int o1Level = RolePermissionLevelEnum.get(o1.getPermissionLevel().getCode()).getLevel();
                int o2Level = RolePermissionLevelEnum.get(o2.getPermissionLevel().getCode()).getLevel();
                return o1Level-o2Level;
            }
        }).map(PermissionDTO::new).collect(Collectors.toList());
    }
}
