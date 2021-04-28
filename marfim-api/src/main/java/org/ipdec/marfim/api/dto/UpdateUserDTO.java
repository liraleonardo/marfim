package org.ipdec.marfim.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Organization;
import org.ipdec.marfim.api.model.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateUserDTO {
    @NotBlank(message="empty email")
    @Email(message = "invalid email format")
    private String email;

    @Size(min=6, message = "password has less than 6 characters")
    private String password;

    @NotBlank(message="empty name")
    private String name;

    private Boolean isSuper;

    private String avatarUrl;

    private List<OrganizationDTO> organizations;

    public User parseToUser(User user){
        password = password != null && !password.isBlank() && !password.isEmpty()
                ? password: null;
        avatarUrl = avatarUrl==null || avatarUrl.isBlank() ? null : avatarUrl.trim();
        user.setAvatarUrl(avatarUrl);
        user.setEmail(email.trim().toLowerCase()
                .replaceAll("\\s", "")
                .replaceAll("\\t", ""));
        user.setName(name);
        if((password != null)) user.setPassword(password);
        user.setIsSuper(isSuper);

        if(organizations != null){
            List<Organization> organizationList = organizations.stream().map(organizationDTO -> {
                Organization organization = new Organization();
                organization.setId(organizationDTO.getId());
                return organization;
            }).collect(Collectors.toList());
            user.setOrganizations(organizationList);
        }
        return user;
    }
}
