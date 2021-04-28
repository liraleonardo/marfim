package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.CreateOrganizationDTO;
import org.ipdec.marfim.api.exception.OrganizationException;
import org.ipdec.marfim.api.exception.type.OrganizationExceptionsEnum;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.repository.OrganizationRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;


    public Organization findById(Long id) {
        return organizationRepository.findById(id).orElseThrow(()->{
            return new OrganizationException(OrganizationExceptionsEnum.NOT_FOUND);
        });
    }

    public List<Organization> findAll() {
        return organizationRepository.findAll(Sort.by(Sort.Order.asc("name").ignoreCase()));
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

    public Organization create(CreateOrganizationDTO organizationDTO){
        Organization organization = organizationDTO.parseToOrganization(new Organization());

        //TODO: check valid cnpj

        if(!organizationRepository.findByName(organization.getName()).isEmpty()){
            throw new OrganizationException(OrganizationExceptionsEnum.CONFLICT_ORGANIZATION_SAME_NAME);
        }

        if(!organizationRepository.findByCnpj(organization.getCnpj()).isEmpty()){
            throw new OrganizationException(OrganizationExceptionsEnum.CONFLICT_ORGANIZATION_SAME_CNPJ);
        }

        organization = organizationRepository.save(organization);
        return organization;
    }

    public Organization update(Long id, CreateOrganizationDTO organizationDTO){
        Organization organization = organizationDTO.parseToOrganization(findById(id));

        //TODO: check valid cnpj

        List<Organization> organizationsFoundByName = organizationRepository.findByName(organization.getName());
        if(organizationsFoundByName.size()>0 && organizationsFoundByName.stream().anyMatch(found -> found.getId() != id.longValue())){
            throw new OrganizationException(OrganizationExceptionsEnum.CONFLICT_ORGANIZATION_SAME_NAME);
        }
        List<Organization> organizationsFoundByCnpj = organizationRepository.findByCnpj(organization.getCnpj());
        if(organizationsFoundByCnpj.size()>0 && organizationsFoundByCnpj.stream().anyMatch(found -> found.getId() != id.longValue())){
            throw new OrganizationException(OrganizationExceptionsEnum.CONFLICT_ORGANIZATION_SAME_CNPJ);
        }

        organization = organizationRepository.save(organization);
        return organization;
    }

    public void delete(Long id) {
        findById(id);
        organizationRepository.deleteById(id);
    }

}
