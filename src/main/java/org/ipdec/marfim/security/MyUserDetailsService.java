package org.ipdec.marfim.security;

import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.Role;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MyUserDetailsService implements UserDetailsService {


    private final UserRepository userRepository;

    @Autowired
    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        MarfimUserDetails marfimUserDetails = null;
        User user = userRepository.findByEmail(username).orElseThrow(()-> new UsernameNotFoundException("user not found"));

        List<String> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toList());
        List<Permission> allPermissions = new ArrayList<>();
        user.getRoles().forEach(role -> {
            allPermissions.addAll(role.getPermissions());
        });
        List<Permission> permissions = allPermissions.stream().distinct().collect(Collectors.toList());
        marfimUserDetails = new MarfimUserDetails(user,roles,permissions);

        return marfimUserDetails;
    }
}
