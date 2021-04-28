package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.CreateOrganizationDTO;
import org.ipdec.marfim.api.exception.OrganizationException;
import org.ipdec.marfim.api.exception.type.OrganizationExceptionsEnum;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.service.OrganizationService;
import org.ipdec.marfim.security.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Validated
@RestController
@RequestMapping(value = "/organization",produces = "application/json" )
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ORGANIZATIONS_READ', 'ORGANIZATIONS_ALL')")
    public List<Organization> findAll() {
        Long organizationId = TenantContext.getLongTenant();
        return organizationService.findAll(organizationId);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ORGANIZATIONS_READ', 'ORGANIZATIONS_ALL')")
    public Organization findOne(@PathVariable(value = "id", required = true) Long organizationId) {
        Long tenantId = TenantContext.getLongTenant();
        if(tenantId != null && tenantId.longValue() != organizationId){
            throw new OrganizationException(OrganizationExceptionsEnum.FORBIDDEN_ORGANIZATION_ID_DOES_NOT_MATCH);
        }

        return organizationService.findById(organizationId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_USER')")
    public Organization create(@RequestBody @Valid CreateOrganizationDTO organizationDTO) {
        Long organizationId = TenantContext.getLongTenant();
        if(organizationId != null){
            throw new OrganizationException(OrganizationExceptionsEnum.FORBIDDEN_CREATE_AND_DELETE_BY_NON_SUPER_USER);
        }
        return organizationService.create(organizationDTO);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ORGANIZATIONS_UPDATE', 'ORGANIZATIONS_ALL')")
    public Organization update(@PathVariable(value = "id", required = true) Long organizationId,
                               @RequestBody @Valid CreateOrganizationDTO organizationDTO) {
        Long tenantId = TenantContext.getLongTenant();
        if(tenantId != null && tenantId.longValue() != organizationId){
            throw new OrganizationException(OrganizationExceptionsEnum.FORBIDDEN_ORGANIZATION_ID_DOES_NOT_MATCH);
        }
        return organizationService.update(organizationId, organizationDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyAuthority('ORGANIZATIONS_DELETE', 'ORGANIZATIONS_ALL')")
    public void delete(@PathVariable(value = "id", required = true) Long organizationId) {
        Long tenantId = TenantContext.getLongTenant();
        if(tenantId != null){
            throw new OrganizationException(OrganizationExceptionsEnum.FORBIDDEN_CREATE_AND_DELETE_BY_NON_SUPER_USER);
        }

        organizationService.delete(organizationId);
    }

}


