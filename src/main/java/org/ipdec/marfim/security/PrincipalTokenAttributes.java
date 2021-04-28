package org.ipdec.marfim.security;

import org.ipdec.marfim.api.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.DefaultOAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Component
public class PrincipalTokenAttributes implements IPrincipalTokenAttributes{
    @Override
    public User getUser() {
        User user = new User();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> attributes = ((DefaultOAuth2AuthenticatedPrincipal) authentication.getPrincipal()).getAttributes();
        user.setId(UUID.fromString((String) attributes.get("id")) );
        user.setName((String) attributes.get("name"));
        user.setEmail((String) attributes.get("email"));
        user.setCreatedAt(LocalDateTime.parse((String) attributes.get("createdAt")) );
        user.setUpdatedAt(LocalDateTime.parse((String) attributes.get("updatedAt")));
        user.setIsSuper((Boolean) attributes.get("isSuper"));
        user.setAvatarUrl((String) attributes.get("avatarUrl"));
        //TODO: Fill user organizations and roles
        return user;
    }
}
