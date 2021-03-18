package org.ipdec.marfim.api.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Collection;


@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DynamicInsert @DynamicUpdate
@Table(name = "role", schema = "marfim")
@AllArgsConstructor
@NoArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "role_permission", schema = "marfim",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_name"))
    private Collection<Permission> permissions;

}
