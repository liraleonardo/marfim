package org.ipdec.marfim.api.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;


@Data
@Entity
@DynamicInsert @DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "permission_resource", schema = "marfim")
public class PermissionResource implements Serializable {
    @Id
    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PermissionResource)) return false;
        PermissionResource permission = (PermissionResource) o;
        return Objects.equals(getCode(), permission.getCode());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getCode());
    }
}
