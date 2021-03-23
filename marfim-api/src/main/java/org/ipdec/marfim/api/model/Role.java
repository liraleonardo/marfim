package org.ipdec.marfim.api.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Collection;


@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DynamicInsert @DynamicUpdate
@Table(name = "role", schema = "marfim")
@AllArgsConstructor
@NoArgsConstructor
public class Role implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    private Organization organization;

    @Column(name = "admin")
    private Boolean isAdmin;

    @OneToMany(mappedBy = "role")
    private Collection<RolePermission> rolePermissions;

}
