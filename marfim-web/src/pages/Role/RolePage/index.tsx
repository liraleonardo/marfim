import { Button } from 'primereact/button';
import { ColumnProps } from 'primereact/column';
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
import Role, { IRole } from '../../../model/Role';
import GenericService from '../../../services/GenericService';
import { Container } from './styles';
import '../role-style.css';
import RoleService from '../../../services/RoleService';

const RolePage: React.FC = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [error, setError] = useState<IErrorState | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const dt: React.RefObject<DataTable> = useRef(null);
  const entity = useMemo(() => {
    return {
      name: 'Perfil de Acesso',
      namePlural: 'Perfis de Acesso',
      gender: 'M' as 'M' | 'F',
    };
  }, []);

  const { addErrorToast, addToast } = useToast();
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

  const roleUsersBodyTemplate = (data: IRole) => {
    return (
      <div>
        <Button
          label={data.usersNumber ? `${data.usersNumber}` : '0'}
          className="p-button-text p-button-info"
          icon="pi pi-users"
          iconPos="right"
        />
      </div>
    );
  };

  const rolePermissionsBodyTemplate = (data: IRole) => {
    if (data.isAdmin) {
      return (
        <span className="p-text-italic">
          Acesso completo a todos os recursos
        </span>
      );
    }
    return (
      <div>
        <Button
          label={data.permissionsNumber ? `${data.permissionsNumber}` : '0'}
          className="p-button-text p-button-info"
          icon="pi pi-unlock"
          iconPos="right"
          tooltip=""
        />
      </div>
    );
  };

  const normalUserColumns: ColumnProps[] = [
    {
      field: 'name',
      header: 'Nome',
      sortable: true,
      body: roleNameBodyTemplate,
    },
    { field: 'description', header: 'Descrição', sortable: true },
    {
      field: 'usersNumber',
      header: 'Usuários',
      sortable: true,
      body: roleUsersBodyTemplate,
      style: {
        width: '10%',
        maxWidth: '120px',
      },
    },
    {
      field: 'permissionsNumber',
      header: 'Permissões',
      sortable: true,
      body: rolePermissionsBodyTemplate,
      style: {
        width: '10%',
      },
    },
  ];

  const fullAccessForAuthoritiesList = ['ROLE_SUPER_USER', 'ROLE_ADMIN_USER'];

  return (
    <Container>
      <CrudPageContainer
        items={roles}
        columns={normalUserColumns}
        dataTableRef={dt}
        isLoading={isLoading}
        errorState={error}
        entity={entity}
        handleConfirmDeleteItem={handleConfirmDeleteRole}
        showItemActionColumn
        showCreateItemButtonForAuthorities={fullAccessForAuthoritiesList}
        showEditActionForAuthorities={fullAccessForAuthoritiesList}
        showDeleteActionForAuthorities={fullAccessForAuthoritiesList}
      />
    </Container>
  );
};

export default RolePage;
