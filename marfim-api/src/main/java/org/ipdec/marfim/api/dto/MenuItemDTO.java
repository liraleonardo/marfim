package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.MenuItem;

import java.util.List;
import java.util.stream.Collectors;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemDTO {
    private Long id;
    private String label;
    private String icon;
    private String pageUrl;
    private String resourceCode;
    private List<MenuItemDTO> children;

    public MenuItemDTO(MenuItem menuItem) {
        id = menuItem.getId();
        label = menuItem.getLabel();
        icon = menuItem.getIcon();
        pageUrl = menuItem.getPageUrl()!=null && menuItem.getPageUrl().isBlank()
                ? null
                : menuItem.getPageUrl();
        if(menuItem.getPermissionResource()!=null){
            resourceCode = menuItem.getPermissionResource().getCode();
        }
        if(menuItem.getChildren()!=null){
            children = menuItem.getChildren().stream().sorted().map(MenuItemDTO::new).collect(Collectors.toList());
            children = children.isEmpty() ? null : children;
        }
    }

}
