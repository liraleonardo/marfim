package org.ipdec.marfim.security;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.ipdec.marfim.api.service.AuthorizationUtilService;
import org.ipdec.marfim.security.permission.CustomAuthority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MarfimUserDetailsService implements UserDetailsService {


    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final AuthorizationUtilService authorizationUtilService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username).orElseThrow(()-> new UsernameNotFoundException("user not found"));
        List<CustomAuthority> authorities = authorizationUtilService.getUserAuthoritiesByUser(user);
        MarfimUserDetails marfimUserDetails = new MarfimUserDetails(user,authorities);
        return marfimUserDetails;
    }
}
