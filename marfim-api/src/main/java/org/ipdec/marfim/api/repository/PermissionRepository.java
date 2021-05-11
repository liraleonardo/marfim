package org.ipdec.marfim.api.repository;

import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.key.PermissionKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, PermissionKey> {

}
