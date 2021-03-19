package org.ipdec.marfim.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Service
public class MarfimUserDetails implements UserDetails {
    private User user;
    private Collection<String> roles;
    private Collection<Permission> authorities;

    public MarfimUserDetails(User user, Collection<String> roles, Collection<Permission> authorities) {
        this.roles = roles;
        this.authorities = authorities;
        this.user = user;

        if(this.user.getIsSuper()){
            this.roles.add("SUPER_USER");
        }

        List<Permission> roleAuthorities = this.roles.stream().map(role -> {
            Permission roleAuthority = new Permission();
            roleAuthority.setName("ROLE_"+role.toUpperCase());
            return roleAuthority;
        }).collect(Collectors.toList());
        this.authorities.addAll(roleAuthorities);

    }

    public MarfimUserDetails(){
        roles = new ArrayList<>();
        authorities = new ArrayList<Permission>();
        this.user = new User();

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
