package org.ipdec.marfim.api.repository;

import org.ipdec.marfim.api.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    @Override
    @Query(value=" select distinct(r) from Role r " +
            " left join fetch r.organization" +
            " left join fetch r.permissions " +
            " where r.id in ?1")
    List<Role> findAllById(Iterable<Long> ids);

    @Query(value=" select distinct(r) from User u " +
            " left join u.roles r" +
            " left join fetch r.organization" +
            " left join fetch r.permissions" +
            " where u.id = ?1")
    List<Role> findAllByUserId(UUID userId);


    @Query(value=" select r from Role r " +
            " where r.name = ?1 and r.organization.id = ?2")
    Optional<Role> findByNameAndOrganizationId(String name, Long organizationId);



}
