import React from 'react';
import { ToggleButton } from 'primereact/togglebutton';
import { Container } from './styles';
import { IPermission } from '../../model/Role';

interface PermissionCheckBoxContainerProps {
  permission?: IPermission;
  checked?: boolean;
  show: boolean;
  handleChange(permission: IPermission, checked: boolean): void;
}

export const PermissionCheckBoxContainer: React.FC<PermissionCheckBoxContainerProps> = ({
  permission,
  checked = false,
  show,
  handleChange,
}) => {
  return (
    <Container>
      {show && permission && (
        <ToggleButton
          key={`${permission.authority}`}
          id={`${permission.authority}`}
          checked={checked}
          onChange={(e) => {
            handleChange(permission, checked);
          }}
          onLabel="Sim"
          onIcon="pi pi-unlock"
          offLabel="Não"
          offIcon="pi pi-lock"
        />
      )}
    </Container>
  );
};
