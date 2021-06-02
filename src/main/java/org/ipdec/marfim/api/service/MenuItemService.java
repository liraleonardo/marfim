package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.MenuItemDTO;
import org.ipdec.marfim.api.repository.MenuItemRepository;
import org.ipdec.marfim.security.IPrincipalTokenAttributes;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    private final IPrincipalTokenAttributes principal;


    public List<MenuItemDTO> findParentMenuItemDTO() {
        return menuItemRepository.findParentMenuItems().stream()
                .sorted()
                .map(MenuItemDTO::new)
                .collect(Collectors.toList());
    }
}
