package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.model.Role;
import org.ipdec.marfim.api.model.RolePermission;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.RoleRepository;
import org.ipdec.marfim.security.permission.CustomAuthority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class AuthorizationUtilService {

    @Autowired
    private final RoleRepository roleRepository;

    public List<CustomAuthority> getUserAuthoritiesByUser(User user){
        List<Long> roleIds;
        if(user.getRoles() == null){
            roleIds = roleRepository.findAllByUserId(user.getId()).stream().map(Role::getId).collect(Collectors.toList());
        }else{
            roleIds = user.getRoles().stream().map(Role::getId).collect(Collectors.toList());
        }

        return getUserAuthoritiesByRoleIds(roleIds,user.isSuper());
    }

    public List<CustomAuthority> getUserAuthoritiesByRoleIds(List<Long> roleIds, Boolean isSuper){
        List<CustomAuthority> authorities = new ArrayList<>();

        if(isSuper){
            authorities.add(new CustomAuthority(CustomAuthority.SUPER_USER));
        }

        List<CustomAuthority> roleAuthorities = getAuthoritiesFromRoleIdList(roleIds);
        authorities.addAll(roleAuthorities);
        return authorities;
    }

    public List<CustomAuthority> getAuthoritiesFromRoleIdList(List<Long> roleIdList){
        List<CustomAuthority> authorities = new ArrayList<>();
        List<Role> userRoles = roleRepository.findAllById(roleIdList);

        userRoles.forEach(role -> {
            List<CustomAuthority> rolePermissions = role.getRolePermissions().stream()
                    .map(rolePermission ->
                            new CustomAuthority(rolePermission.getPermission().getCode(), rolePermission.getLevel() , role.getOrganization().getId())
                    ).collect(Collectors.toList());
            authorities.addAll(rolePermissions);
        });
        return authorities;
    }

}
