package org.ipdec.marfim.api.model.key;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;


@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PermissionKey implements Serializable {
    @Column(name = "permission_resource_code")
    private String permissionResourceCode;

    @Column(name = "permission_level_code")
    private String permissionLevelCode;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PermissionKey)) return false;
        PermissionKey that = (PermissionKey) o;
        return permissionResourceCode.equals(that.permissionResourceCode) && permissionLevelCode.equals(that.permissionLevelCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(permissionResourceCode, permissionLevelCode);
    }
}
