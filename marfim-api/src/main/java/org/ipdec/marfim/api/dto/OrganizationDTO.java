package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Organization;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class OrganizationDTO {
    Long id;
    String name;
    String avatarUrl;

    public OrganizationDTO(Organization organization) {
        id = organization.getId();
        name = organization.getName();
        avatarUrl = organization.getAvatarUrl();
    }
}
