package org.ipdec.marfim.security.permission;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;
import java.util.Objects;

@AllArgsConstructor
@Getter
public enum RolePermissionLevelEnum {
    //TODO: review role permission levels
    NONE(0,"NONE", "Sem Acesso"),
    READ(1,"READ", "Leitura"),
    CREATE(2,"CREATE", "Criação"),
    UPDATE(3,"UPDATE", "Atualização"),
    DELETE(4,"DELETE", "Remoção"),
    ALL(100,"ALL", "Todos os Acessos");

    private final int level;
    private final String code;
    private final String levelName;

    public static RolePermissionLevelEnum get(int level){
        return Arrays.stream(RolePermissionLevelEnum.values()).filter(permission -> permission.getLevel() == level).findFirst().orElse(NONE);
    }

    public static RolePermissionLevelEnum get(String code){
        return Arrays.stream(RolePermissionLevelEnum.values()).filter(permission -> Objects.equals(permission.getCode(), code)).findFirst().orElse(NONE);
    }

}
