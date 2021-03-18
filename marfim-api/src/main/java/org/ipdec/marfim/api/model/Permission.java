package org.ipdec.marfim.api.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;


@Data
@Entity
@DynamicInsert @DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "permission", schema = "marfim")
public class Permission implements GrantedAuthority {
    @Id
    @Column(nullable = false)
    private String name;

    @Column
    private String description;


    @Override
    public String getAuthority() {
        return name;
    }
}
