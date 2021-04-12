package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.CreateOrganizationDTO;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.service.OrganizationService;
import org.ipdec.marfim.security.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"requested organization id does not match the Tenant-ID");
        }

        return organizationService.findById(organizationId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_USER')")
    public Organization create(@RequestBody @Valid CreateOrganizationDTO organizationDTO) {
        Long organizationId = TenantContext.getLongTenant();
        return organizationService.create(organizationDTO);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ORGANIZATIONS_UPDATE', 'ORGANIZATIONS_ALL')")
    public Organization update(@PathVariable(value = "id", required = true) Long organizationId,
                               @RequestBody @Valid CreateOrganizationDTO organizationDTO) {
        Long tenantId = TenantContext.getLongTenant();
        if(tenantId != null && tenantId.longValue() != organizationId){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"requested organization id does not match the Tenant-ID");
        }
        return organizationService.update(organizationId, organizationDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyAuthority('ORGANIZATIONS_DELETE', 'ORGANIZATIONS_ALL')")
    public void delete(@PathVariable(value = "id", required = true) Long organizationId) {
        Long tenantId = TenantContext.getLongTenant();
        if(tenantId != null && tenantId.longValue() != organizationId){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"requested organization id does not match the Tenant-ID");
        }

        organizationService.delete(organizationId);
    }

}


