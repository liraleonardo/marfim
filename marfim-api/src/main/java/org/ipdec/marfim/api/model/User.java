package org.ipdec.marfim.api.model;


import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.UUID;


@Data
@Entity
@DynamicInsert @DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user", schema = "marfim")
@Where(clause = "enabled=true")
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String email;

    @Column
    @JsonIgnore()
    private String password;

    @Column(nullable = false)
    private String name;

    @Column
    private String avatarUrl;

    @Column
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column
    private Boolean enabled;

    @Column(name="super")
    private Boolean isSuper;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role", schema = "marfim",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Collection<Role> roles;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "organization_user", schema = "marfim",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "organization_id"))
    private Collection<Organization> organizations;

    @JsonIgnore
    public Boolean isSuper(){
        return isSuper != null && isSuper;
    }

}
