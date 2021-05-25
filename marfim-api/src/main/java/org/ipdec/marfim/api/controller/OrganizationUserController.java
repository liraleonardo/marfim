package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.UserDTO;
import org.ipdec.marfim.api.service.OrganizationUserService;
import org.ipdec.marfim.security.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Validated
@RestController
@RequestMapping(value = "/organization/user",produces = "application/json" )
public class OrganizationUserController {

    @Autowired
    private OrganizationUserService organizationUserService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('USERS_READ', 'USERS_ALL')")
    public List<UserDTO> findAll(@RequestParam(name="name") Optional<String> userName) {
        Long tenantId = TenantContext.getLongTenant();
        return organizationUserService.findAllUsersDTO(tenantId, userName);
    }

    @GetMapping("/unlinked")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ORGANIZATION_USERS_ASSOCIATE', 'USERS_READ', 'USERS_ALL')")
    public UserDTO findByEmail(@RequestParam(value = "email") @Valid @Email(message = "invalid email") String email) {
        Long organizationId = TenantContext.getLongTenant();
        return organizationUserService.findUserDTOByEmail(email, organizationId);
    }

    @PatchMapping("/{userId}/link")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyAuthority('ORGANIZATION_USERS_ASSOCIATE', 'USERS_UPDATE', 'USERS_ALL')")
    public void linkUserWithOrganization(@PathVariable(value = "userId") UUID userId) {
        Long organizationId = TenantContext.getLongTenant();
        organizationUserService.linkUserWithOrganization(userId, organizationId);
    }




}


