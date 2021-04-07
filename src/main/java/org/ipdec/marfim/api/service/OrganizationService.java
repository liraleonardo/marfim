package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;


    public List<Organization> findAll() {
        return organizationRepository.findAll();
    }

    public List<Organization> findAll(Long organizationId) {
        List<Organization> allOrganizations = findAll();
        if(organizationId==null) {
            return allOrganizations;
        }

        return allOrganizations.stream().filter(organization ->
            organization.getId().longValue() == organizationId
        ).collect(Collectors.toList());

    }

}
