package org.ipdec.marfim.api.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Objects;


@Data
@Entity
@DynamicInsert @DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "permission_level", schema = "marfim")
public class PermissionLevel implements Serializable, Comparable<PermissionLevel> {
    @Id
    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PermissionLevel)) return false;
        PermissionLevel permission = (PermissionLevel) o;
        return Objects.equals(getCode(), permission.getCode());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getCode());
    }

    @Override
    public int compareTo(PermissionLevel o) {
        return this.name.compareTo(o.name);
    }
}
