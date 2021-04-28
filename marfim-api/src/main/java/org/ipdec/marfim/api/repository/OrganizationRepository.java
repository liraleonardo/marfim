package org.ipdec.marfim.api.repository;

import org.ipdec.marfim.api.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    List<Organization> findByName(String name);

    List<Organization> findByCnpj(String cnpj);

}
