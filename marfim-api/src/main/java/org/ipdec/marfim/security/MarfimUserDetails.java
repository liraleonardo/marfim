package org.ipdec.marfim.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.Role;
import org.ipdec.marfim.api.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.*;

@Data
@Service
@NoArgsConstructor
public class MarfimUserDetails implements UserDetails {
    private User user = new User();
    private Collection<String> roles = new ArrayList<>();
    private Collection<Permission> authorities = new HashSet<>();

   public MarfimUserDetails(User user) {
        this.user = user;

        if(this.user.isSuper()){
            String SUPER_USER = "SUPER_USER";
            this.roles.add(SUPER_USER);
            this.authorities.add(new Permission("ROLE_".concat(SUPER_USER),"ROLE_".concat(SUPER_USER)));
        }

        Collection<Role> roles = this.user.getRoles();
        if(roles!=null){
            roles.forEach(role -> {
                //add role to roles list
                this.roles.add(role.getName());

                //add role as authority with ROLE_ prefix
                String roleAuthorityName = "ROLE_".concat(role.getName().toUpperCase());
                this.authorities.add(new Permission(roleAuthorityName, roleAuthorityName));

                //add all permissions as authority
                if(role.getPermissions()!=null)
                    this.authorities.addAll(role.getPermissions());
            });

        }

    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @JsonIgnore
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @JsonIgnore
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return user.getEnabled();
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return user.getEnabled();
    }
}
