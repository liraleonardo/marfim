package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.CreateOrganizationDTO;
import org.ipdec.marfim.api.exception.OrganizationException;
import org.ipdec.marfim.api.exception.type.OrganizationExceptionsEnum;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.repository.OrganizationRepository;
import org.ipdec.marfim.security.IPrincipalTokenAttributes;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    private final IPrincipalTokenAttributes principal;


    public Organization findById(Long organizationId, Long tenantId) {
        if(!principal.getUser().isSuper() && !Objects.equals(tenantId, organizationId)){
            throw new OrganizationException(OrganizationExceptionsEnum.FORBIDDEN_ORGANIZATION_ID_DOES_NOT_MATCH);
        }
        return organizationRepository.findById(organizationId).orElseThrow(()->{
            return new OrganizationException(OrganizationExceptionsEnum.NOT_FOUND);
        });
    }

    public List<Organization> findAll() {
        return organizationRepository.findAll(Sort.by(Sort.Order.asc("name").ignoreCase()));
    }

    public List<Organization> findAll(Long organizationId) {
        List<Organization> allOrganizations = findAll();
        if(principal.getUser().isSuper()) {
            return allOrganizations;
        }

        return allOrganizations.stream().filter(organization ->
            organization.getId().longValue() == organizationId
        ).collect(Collectors.toList());

    }

    public Organization create(CreateOrganizationDTO organizationDTO){
        if(!principal.getUser().isSuper()){
            throw new OrganizationException(OrganizationExceptionsEnum.FORBIDDEN_CREATE_AND_DELETE_BY_NON_SUPER_USER);
        }
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

    public Organization update(Long id, CreateOrganizationDTO organizationDTO, Long tenantId){
        Organization organization = organizationDTO.parseToOrganization(findById(id, tenantId));

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

    public void delete(Long id, Long tenantId) {
        if(!principal.getUser().isSuper()){
            throw new OrganizationException(OrganizationExceptionsEnum.FORBIDDEN_CREATE_AND_DELETE_BY_NON_SUPER_USER);
        }
        findById(id, tenantId);
        organizationRepository.deleteById(id);
    }

}
