package org.ipdec.marfim.api.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.ipdec.marfim.api.model.key.PermissionKey;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;


@Data
@Entity
@DynamicInsert @DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "permission", schema = "marfim")
public class Permission implements Serializable {

    @EmbeddedId
    PermissionKey id;

    @ManyToOne
    @MapsId("permissionResourceCode")
    @JoinColumn(name = "permission_resource_code")
    private PermissionResource permissionResource;

    @ManyToOne
    @MapsId("permissionLevelCode")
    @JoinColumn(name = "permission_level_code")
    private PermissionLevel permissionLevel;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Permission)) return false;
        Permission permission = (Permission) o;
        return Objects.equals(getId(), permission.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    public String getAuthority() {
        String authority = id.getPermissionResourceCode()
                .concat("_")
                .concat(id.getPermissionLevelCode());
        return authority;
    }
}
