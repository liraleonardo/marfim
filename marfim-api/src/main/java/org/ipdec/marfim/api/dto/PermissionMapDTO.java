package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.PermissionResource;
import org.ipdec.marfim.security.permission.RolePermissionLevelEnum;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
public class PermissionMapDTO {
    private String label;
    private String resourceCode;
    private String resourceIcon;
    private List<PermissionDTO> permissions;
    private HashMap<String, Boolean> level;

    public PermissionMapDTO(PermissionResource resource, List<Permission> permissionsList) {
        this.label = resource.getName();
        this.resourceCode = resource.getCode();
        this.resourceIcon = resource.getIcon();
        this.permissions = permissionsList.stream().sorted(new Comparator<Permission>() {
            @Override
            public int compare(Permission o1, Permission o2) {
                int o1Level = RolePermissionLevelEnum.get(o1.getPermissionLevel().getCode()).getLevel();
                int o2Level = RolePermissionLevelEnum.get(o2.getPermissionLevel().getCode()).getLevel();
                return o1Level-o2Level;
            }
        }).map(PermissionDTO::new).collect(Collectors.toList());
        this.level = new HashMap<>();
        this.permissions.forEach(permissionDTO -> {
            this.level.put(permissionDTO.getLevelCode(),false);
        });

    }
}
