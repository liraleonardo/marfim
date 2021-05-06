package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.PermissionGroupDTO;
import org.ipdec.marfim.api.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping(value = "/permission",produces = "application/json" )
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    @GetMapping("/grouped")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('ROLES_READ', 'ROLES_ALL')")
    public List<PermissionGroupDTO> findAll() {
        return permissionService.findAllPermissionsGrouped();
    }


}


