package org.ipdec.marfim.security.permission;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

@AllArgsConstructor
@Getter
public enum RolePermissionLevelEnum {
    //TODO: review role permission levels
    NONE(0,"NONE", "Sem Acesso"),
    READ(1,"READ", "Leitura"),
    CREATE(2,"CREATE", "Criação"),
    UPDATE(3,"UPDATE", "Atualização"),
    DELETE(4,"DELETE", "Remoção"),
    WRITE(5,"WRITE", "Escrita"),
    ALL(100,"ALL", "Todos os Acessos");

    private final int level;
    private final String code;
    private final String levelName;

    public static RolePermissionLevelEnum get(int level){
        return Arrays.stream(RolePermissionLevelEnum.values()).filter(permission -> permission.getLevel() == level).findFirst().orElse(NONE);
    }

}
