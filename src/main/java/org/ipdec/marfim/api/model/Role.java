package org.ipdec.marfim.api.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.dao.DataIntegrityViolationException;

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

    @ManyToMany
    @JoinTable(
            name = "role_permission",
            schema = "marfim",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = { @JoinColumn(name = "permission_level_code"), @JoinColumn(name = "permission_resource_code")})
    private Collection<Permission> permissions;

    @ManyToMany
    @JoinTable(
            name = "user_role",
            schema = "marfim",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = { @JoinColumn(name = "user_id")})
    private Collection<User> users;

    @PreRemove
    public void checkForUsersWithThisRole(){
        if(!users.isEmpty()){
            throw new DataIntegrityViolationException("should not delete role with users associated");
        }
    }

}
