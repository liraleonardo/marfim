package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Permission;

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
        this.permissions = permissionsList.stream().map(PermissionDTO::new).collect(Collectors.toList());
    }
}
