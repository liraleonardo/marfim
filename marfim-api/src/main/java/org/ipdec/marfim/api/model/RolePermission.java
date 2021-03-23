package org.ipdec.marfim.api.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.ipdec.marfim.api.model.key.RolePermissionKey;

import javax.persistence.*;
import java.io.Serializable;


@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DynamicInsert @DynamicUpdate
@Table(name = "role_permission", schema = "marfim")
@AllArgsConstructor
@NoArgsConstructor
public class RolePermission implements Serializable {

    @EmbeddedId
    RolePermissionKey id;

    @JsonIgnore
    @ManyToOne
    @MapsId("roleId")
    @JoinColumn(name = "role_id")
    private Role role;

    @ManyToOne
    @MapsId("permissionCode")
    @JoinColumn(name = "permission_code")
    private Permission permission;

    @Column
    private Integer level;
}
