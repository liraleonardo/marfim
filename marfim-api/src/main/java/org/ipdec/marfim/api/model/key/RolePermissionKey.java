package org.ipdec.marfim.api.model.key;


import javax.persistence.*;
import java.io.Serializable;


@Embeddable
public class RolePermissionKey implements Serializable {
    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "permission_code")
    private String permissionCode;

}
