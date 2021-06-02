package org.ipdec.marfim.api.controller;

import org.ipdec.marfim.api.dto.*;
import org.ipdec.marfim.api.service.MenuItemService;
import org.ipdec.marfim.security.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping(value = "/menu-items",produces = "application/json" )
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<MenuItemDTO> findAllParents() {
        Long organizationId = TenantContext.getLongTenant();
        //THINKABOUT: it could be interesting to consider the organization menu items?
        return menuItemService.findParentMenuItemDTO();
    }

}


