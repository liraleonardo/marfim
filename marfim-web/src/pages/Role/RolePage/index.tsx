import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
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
import { IRole } from '../../../model/Role';
import GenericService from '../../../services/GenericService';
import { Container } from './styles';
import '../role-style.css';

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

  const { addErrorToast } = useToast();
  const { selectedOrganization } = useAuth();

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

  const handleConfirmDeleteRole = useCallback((rowData: any): void => {
    // console.log('delete role', rowData.name);
  }, []);

  const avatarNameBodyTemplate = (rowData: IRole) => {
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

  const rolePermissionLevelBodyTemplate = (rowData: IRole) => {
    if (rowData.permissions && rowData.permissions.length > 0)
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {rowData.permissions.map((permission: any) => (
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
          <h5>Permissões para {data.name}</h5>
          <Button
            icon="pi pi-unlock"
            label="Alterar Permissões"
            className="p-button p-button-info p-mr-2 "
            onClick={() => console.log(data)}
            tooltip={`Alterar permissões de '${data.name}'`}
          />
        </div>
        <DataTable value={data.permissions} emptyMessage="Nenhuma permissão">
          <Column field="label" header="Recurso" sortable />
          <Column
            field="permissions"
            header="Níveis de acesso"
            body={rolePermissionLevelBodyTemplate}
            sortable={false}
          />
        </DataTable>
      </div>
    );
  };

  const fullAccessForAuthoritiesList = [
    'ROLES_ALL',
    'ROLE_SUPER_USER',
    'ROLE_ADMIN_USER',
  ];

  return (
    <Container>
      <CrudPageContainer
        items={roles}
        columns={[
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
          {
            field: 'organization.name',
            header: 'Organização',
            body: avatarNameBodyTemplate,
            sortable: true,
          },
        ]}
        dataTableRef={dt}
        isLoading={isLoading}
        errorState={error}
        entity={entity}
        handleConfirmDeleteItem={handleConfirmDeleteRole}
        showItemActionColumn
        showCreateItemButtonForAuthorities={[
          'ROLES_CREATE',
          ...fullAccessForAuthoritiesList,
        ]}
        showEditActionForAuthorities={[
          'ROLES_UPDATE',
          ...fullAccessForAuthoritiesList,
        ]}
        showDeleteActionForAuthorities={[
          'ROLES_DELETE',
          ...fullAccessForAuthoritiesList,
        ]}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
      />
    </Container>
  );
};

export default RolePage;
