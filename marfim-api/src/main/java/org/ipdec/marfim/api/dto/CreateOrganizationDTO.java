package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Organization;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateOrganizationDTO {
    @NotBlank(message="empty name")
    private String name;

    @NotBlank(message="empty cnpj")
    @Size(min=14, max = 14, message = "cnpj must have 14 characters")
    private String cnpj;

    private String description;

    private String avatarUrl;

    public Organization parseToOrganization(Organization organization){
        description = description==null || description.trim().isBlank() ? null : description.trim();
        avatarUrl = avatarUrl==null || avatarUrl.trim().isBlank() ? null : avatarUrl.trim();

        organization.setName(name);
        organization.setCnpj(cnpj);
        organization.setDescription(description);
        organization.setAvatarUrl(avatarUrl);

        return organization;
    }
}
