import { Button } from 'primereact/button';
import { Column, ColumnProps } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AvatarNameContainer } from '../../../components/AvatarNameContainer';
import CrudPageContainer, {
  HandleErrorProps,
} from '../../../components/CrudPageContainer';
import { IErrorState } from '../../../errors/AppErrorInterfaces';
import { handleAxiosError } from '../../../errors/axiosErrorHandler';
import { roleErrors } from '../../../errors/roleErrors';
import { useAuth } from '../../../hooks/auth';
import { useToast } from '../../../hooks/toast';
import Role, {
  IPermission,
  IPermissionGroup,
  IRole,
} from '../../../model/Role';
import GenericService from '../../../services/GenericService';
import { Container } from './styles';
import '../role-style.css';
import RoleService from '../../../services/RoleService';

const RolePage: React.FC = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [error, setError] = useState<IErrorState | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<IRole[]>([]);

  const dt: React.RefObject<DataTable> = useRef(null);
  const entity = useMemo(() => {
    return {
      name: 'Perfil de Acesso',
      namePlural: 'Perfis de Acesso',
      gender: 'M' as 'M' | 'F',
    };
  }, []);

  const { addErrorToast, addToast } = useToast();
  const { selectedOrganization, user: authUser } = useAuth();

  const handleError = useCallback(
    ({
      error: err,
      errorAction,
      handleAsPageError = false,
    }: HandleErrorProps) => {
      const handledError = handleAxiosError(err, roleErrors);
      const { messages, isPageError } = handledError;
      messages.forEach((message) => addErrorToast(errorAction, message));
      if (isPageError || handleAsPageError) {
        setError(handledError);
      }
    },
    [addErrorToast],
  );

  const reloadRoles = useCallback(() => {
    setIsLoading(true);
    setRoles([]);
    const roleService = new GenericService<IRole, number>('role');
    roleService
      .findAll()
      .then((data) => {
        if (data) setRoles(data);
      })
      .catch((err) => {
        handleError({ error: err, errorAction: 'carregar organizações' });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [handleError]);

  useEffect(() => {
    setError(undefined);
    reloadRoles();
  }, [selectedOrganization, reloadRoles]);

  const handleConfirmDeleteRole = useCallback(
    (rowData: IRole): void => {
      if (rowData.id) {
        const roleService = new RoleService();
        roleService
          .deleteRole(rowData.id)
          .then(() => {
            addToast({
              title: `${entity.name} deletad${
                entity.gender === 'M' ? 'o' : 'a'
              } com Sucesso`,
              type: 'success',
            });
            reloadRoles();
          })
          .catch((err) =>
            handleError({
              error: err,
              errorAction: `apagar ${entity.name.toLowerCase()}`,
            }),
          );
      }
    },
    [addToast, entity, handleError, reloadRoles],
  );

  const avatarNameBodyTemplate = (rowData: Role) => {
    return (
      rowData.organization && (
        <AvatarNameContainer
          name={rowData.organization.name}
          avatarUrl={rowData.organization.avatarUrl}
          defaultAvatarIcon="pi pi-briefcase"
        />
      )
    );
  };

  const roleNameBodyTemplate = (rowData: IRole) => {
    return (
      <AvatarNameContainer
        name={rowData.name}
        defaultAvatarIcon="pi pi-lock"
        showAvatar={false}
        badge={
          rowData.isAdmin ? { value: 'ADMIN', severity: 'success' } : undefined
        }
      />
    );
  };

  const rolePermissionLevelBodyTemplate = (rowData: IPermissionGroup) => {
    if (rowData.permissions && rowData.permissions.length > 0)
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {rowData.permissions.map((permission: IPermission) => (
            <span
              key={`${permission.resourceCode}_${permission.levelCode}`}
              className={`p-mr-1 p-mb-1 permission-badge level-${permission.levelCode.toLowerCase()} p-shadow-1`}
            >
              {permission.levelName}
            </span>
          ))}
        </div>
      );
    return '';
  };

  const rowExpansionTemplate = (data: IRole) => {
    return data.isAdmin ? (
      <span className="p-text-bold p-ml-5">
        Este perfil possui acesso a todos os recursos
      </span>
    ) : (
      <div className="orders-subtable">
        <div className="p-d-flex p-jc-between p-ai-baseline  ">
          <h6>Permissões do perfil {data.name}</h6>
        </div>
        <DataTable
          value={data.groupedPermissions}
          emptyMessage="Nenhuma permissão"
        >
          <Column field="label" header="Recurso" sortable />
          <Column
            field="groupedPermissions"
            header="Níveis de acesso"
            body={rolePermissionLevelBodyTemplate}
            sortable={false}
          />
        </DataTable>
      </div>
    );
  };

  const fullAccessForAuthoritiesList = ['ROLE_SUPER_USER', 'ROLE_ADMIN_USER'];

  const normalUserColumns: ColumnProps[] = [
    {
      expander: true,
      style: { width: '3em' },
    },
    {
      field: 'name',
      header: 'Nome',
      sortable: true,
      body: roleNameBodyTemplate,
    },
    { field: 'description', header: 'Descrição', sortable: true },
  ];

  const superUserColumns: ColumnProps[] = [
    ...normalUserColumns,
    {
      field: 'organization.name',
      header: 'Organização',
      body: avatarNameBodyTemplate,
      sortable: true,
    },
  ];

  return (
    <Container>
      <CrudPageContainer
        items={roles}
        columns={authUser.isSuper ? superUserColumns : normalUserColumns}
        dataTableRef={dt}
        isLoading={isLoading}
        errorState={error}
        entity={entity}
        handleConfirmDeleteItem={handleConfirmDeleteRole}
        showItemActionColumn
        showCreateItemButtonForAuthorities={fullAccessForAuthoritiesList}
        showEditActionForAuthorities={fullAccessForAuthoritiesList}
        showDeleteActionForAuthorities={fullAccessForAuthoritiesList}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
      />
    </Container>
  );
};

export default RolePage;
