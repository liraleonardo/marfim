package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.MenuItemDTO;
import org.ipdec.marfim.api.repository.MenuItemRepository;
import org.ipdec.marfim.security.IPrincipalTokenAttributes;
import org.ipdec.marfim.security.permission.CustomAuthority;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    private final IPrincipalTokenAttributes principal;

    public List<MenuItemDTO> findParentMenuItemDTO(Long organizationId) {
        List<MenuItemDTO> result = menuItemRepository.findParentMenuItems().stream()
                .sorted()
                .map(MenuItemDTO::new)
                .collect(Collectors.toList());

        List<String> authoritiesOnOrganization = principal.getUserDetails().getAuthorities().stream()
                .map(grantedAuthority -> ((CustomAuthority) grantedAuthority))
                .filter(authority -> Objects.equals(authority.getOrganizationId(),organizationId))
                .map(CustomAuthority::getAuthority)
                .collect(Collectors.toList());

        boolean isAdmin = authoritiesOnOrganization.stream().anyMatch(authority -> authority.equalsIgnoreCase("ROLE_ADMIN_USER"));
        if(principal.getUser().isSuper() || isAdmin){
            return result;
        }

        result = removeUnauthorizedMenuItems(result, authoritiesOnOrganization);

        return result;
    }

    private List<MenuItemDTO> removeUnauthorizedMenuItems(List<MenuItemDTO> menuItems, List<String> authorities) {
        if(menuItems==null || menuItems.isEmpty()){
            return null;
        }
        return menuItems.stream()
                .filter(menuItem -> menuItem.getResourceCode() == null
                        || menuItem.getResourceCode().isBlank()
                        || authorities.stream().anyMatch(authority -> authority.contains(menuItem.getResourceCode())))
                .peek(menuItem -> menuItem.setChildren(removeUnauthorizedMenuItems(menuItem.getChildren(), authorities)))
                .filter(menuItem -> (menuItem.getChildren()!=null && !menuItem.getChildren().isEmpty())
                        || (menuItem.getPageUrl()!=null && !menuItem.getPageUrl().isBlank()))
                .collect(Collectors.toList());

    }
}
