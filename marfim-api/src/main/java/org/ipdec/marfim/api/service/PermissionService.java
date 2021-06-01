package org.ipdec.marfim.api.service;

import lombok.AllArgsConstructor;
import org.ipdec.marfim.api.dto.PermissionGroupDTO;
import org.ipdec.marfim.api.dto.PermissionMapDTO;
import org.ipdec.marfim.api.model.Permission;
import org.ipdec.marfim.api.model.PermissionResource;
import org.ipdec.marfim.api.repository.PermissionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public List<Permission> findAll() {
        return permissionRepository.findAll(Sort.by(
                Sort.Order.asc("permissionResource.name").ignoreCase()
                ));
    }

    public List<PermissionGroupDTO> findAllPermissionsGrouped() {
        List<Permission> allPermissions = findAll();

        Map<PermissionResource, List<Permission>> groupedPermissions = allPermissions.stream()
                .collect(Collectors.groupingBy(Permission::getPermissionResource));

        return groupedPermissions.keySet().stream().sorted()
                .map(permissionResource -> new PermissionGroupDTO(permissionResource.getName(), groupedPermissions.get(permissionResource)))
                .collect(Collectors.toList());
    }

    public List<PermissionMapDTO> findAllPermissionsGroupedMap() {
        List<Permission> allPermissions = findAll();

        Map<PermissionResource, List<Permission>> groupedPermissions = allPermissions.stream()
                .collect(Collectors.groupingBy(Permission::getPermissionResource));

        return groupedPermissions.keySet().stream().sorted()
                .map(permissionResource -> new PermissionMapDTO(permissionResource, groupedPermissions.get(permissionResource)))
                .collect(Collectors.toList());
    }




}
