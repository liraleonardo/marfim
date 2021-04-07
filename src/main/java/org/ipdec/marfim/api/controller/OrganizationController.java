package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.service.OrganizationService;
import org.ipdec.marfim.security.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping(value = "/organization",produces = "application/json" )
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ORGANIZATIONS_READ')")
    public List<Organization> findAll() {
        Long organizationId = TenantContext.getLongTenant();
        return organizationService.findAll(organizationId);
    }

}


