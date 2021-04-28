package org.ipdec.marfim.api.model.key;


import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;


@Embeddable
@Data
public class RolePermissionKey implements Serializable {
    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "permission_code")
    private String permissionCode;

    @Column(name = "level")
    private Integer level;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RolePermissionKey)) return false;
        RolePermissionKey that = (RolePermissionKey) o;
        return roleId.equals(that.roleId) && permissionCode.equals(that.permissionCode) && level.equals(that.level);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roleId, permissionCode, level);
    }
}
