package org.ipdec.marfim.security.permission;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

@AllArgsConstructor
public class CustomAuthority implements GrantedAuthority {
    public static final String SUPER_USER = "ROLE_SUPER_USER";
    public static final String ADMIN_USER = "ROLE_ADMIN_USER";

    private String permissionCode;

    private String permissionLevel;

    @Getter
    private Long organizationId;

    public CustomAuthority(String permissionCode) {
        if(!permissionCode.equalsIgnoreCase(SUPER_USER)){
            throw new IllegalArgumentException(String.format("%s - Only %s can be constructed without organizationId",this.getClass().getName(),SUPER_USER));
        }
        this.permissionCode = SUPER_USER;
    }

    public CustomAuthority(String permissionCode, Long organizationId) {
        if(!permissionCode.equalsIgnoreCase(ADMIN_USER)){
            throw new IllegalArgumentException(String.format("%s - Only %s can be constructed without permissionLevel",this.getClass().getName(),ADMIN_USER));
        }
        this.permissionCode = ADMIN_USER;
        this.organizationId = organizationId;
    }

    @Override
    public String getAuthority() {
        String authority = permissionLevel == null ?
                permissionCode :
                permissionCode.concat("_").concat(permissionLevel);
        return authority;
    }
}
