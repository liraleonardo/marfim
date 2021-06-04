package org.ipdec.marfim.api.repository;

import org.ipdec.marfim.api.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    @Query(value=" select m from MenuItem m " +
            " where m.parent = null " +
            " order by m.label")
    List<MenuItem> findParentMenuItems();

}
