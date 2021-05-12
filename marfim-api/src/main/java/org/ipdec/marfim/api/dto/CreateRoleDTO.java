package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.*;
import org.ipdec.marfim.api.model.key.PermissionKey;

import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class CreateRoleDTO {
    private Long id;
    @NotBlank(message="empty name")
    private String name;
    private String description;
    private Boolean isAdmin;
    private List<PermissionDTO> permissions;
    private List<UserDTO> users;

    public CreateRoleDTO(Role role) {
        id = role.getId();
        name = role.getName();
        description = role.getDescription();
        isAdmin = role.getIsAdmin();
        permissions = role.getPermissions().stream().map(PermissionDTO::new).collect(Collectors.toList());
        users = role.getUsers().stream().map(UserDTO::new).collect(Collectors.toList());
    }

    public Role parseToRole(Role role) {
        description = description==null || description.isBlank() ? null : description.trim();

        role.setId(id);
        role.setName(name);
        role.setDescription(description);
        role.setIsAdmin(isAdmin);

        if(users!=null) {
            List<User> usersList = users.stream().map(userDTO -> {
                User user = new User();
                user.setId(userDTO.getId());
                return user;
            }).collect(Collectors.toList());

            role.setUsers(usersList);
        }

        if(permissions!=null){
            Set<Permission> permissionsList = permissions.stream()
                    .map(permissionDTO -> {
                        PermissionKey key = new PermissionKey(permissionDTO.getResourceCode(), permissionDTO.getLevelCode());
                        Permission permission = new Permission();
                        permission.setId(key);
                        return permission;
                    })
                    .collect(Collectors.toSet());
            role.setPermissions(permissionsList);
        }

        return role;
    }

}
