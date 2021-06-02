package org.ipdec.marfim.api.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.SortNatural;

import javax.persistence.*;
import java.io.Serializable;
import java.util.SortedSet;


@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DynamicInsert @DynamicUpdate
@Table(name = "menu_item", schema = "marfim")
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class MenuItem implements Serializable, Comparable<MenuItem> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private String icon;

    @Column
    private String pageUrl;

    @Column
    private Long order;

    @ManyToOne
    @JoinColumn(name = "permission_resource_code")
    private PermissionResource permissionResource;

    @ManyToOne
    private MenuItem parent;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "parent")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Setter
    @SortNatural
    private SortedSet<MenuItem> children;

    @Override
    public int compareTo(MenuItem that) {
        int resultFromOrderField = this.order.compareTo(that.getOrder());
        if(resultFromOrderField == 0){
            return this.label.compareTo(that.getLabel());
        }
        return resultFromOrderField;
    }

}
