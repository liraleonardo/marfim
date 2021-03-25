package org.ipdec.marfim.security.permission;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

@AllArgsConstructor
public class CustomAuthority implements GrantedAuthority {
    public static final String SUPER_USER = "ROLE_SUPER_USER";

    private String permissionCode;

    private Integer permissionLevel;

    @Getter
    private Long organizationId;

    public CustomAuthority(String permissionCode) {
        if(!permissionCode.equalsIgnoreCase(SUPER_USER)){
            throw new IllegalArgumentException(String.format("%s - Only %s can be constructed without organizationId",this.getClass().getName(),SUPER_USER));
        }
        this.permissionCode = SUPER_USER;
    }

    @Override
    public String getAuthority() {
        String authority = permissionLevel == null ?
                permissionCode :
                permissionCode.concat("_").concat(RolePermissionLevelEnum.get(permissionLevel).getCode());
        return authority;
    }
}
