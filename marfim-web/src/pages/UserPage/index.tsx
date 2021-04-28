import { DataTable } from 'primereact/datatable';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AvatarGroup } from 'primereact/avatargroup';
import { Avatar } from 'primereact/avatar';
import { Tooltip } from 'primereact/tooltip';
import { ColumnProps } from 'primereact/column';
import CrudPageContainer, {
  HandleErrorProps,
} from '../../components/CrudPageContainer';
import { useAuth } from '../../hooks/auth';
import { AvatarNameContainer } from '../../components/AvatarNameContainer';
import { handleAxiosError } from '../../errors/axiosErrorHandler';
import { useToast } from '../../hooks/toast';
import { IErrorState } from '../../errors/AppErrorInterfaces';
import UserService from '../../services/UserService';
import User from '../../model/User';

const UserPage: React.FC = () => {
  const dt: React.RefObject<DataTable> = useRef(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<IErrorState | undefined>();

  const { selectedOrganization, user: authUser } = useAuth();
  const { addErrorToast, addToast } = useToast();
  const MAX_ORGANIZATIONS_TO_SHOW = 5;

  const entity = useMemo(() => {
    return {
      name: 'Usuário',
      namePlural: 'Usuários',
      gender: 'M' as 'M' | 'F',
    };
  }, []);

  const handleError = useCallback(
    ({
      error: err,
      errorAction,
      handleAsPageError = false,
    }: HandleErrorProps) => {
      const handledError = handleAxiosError(err, []);
      const { messages, isPageError } = handledError;
      messages.forEach((message) => addErrorToast(errorAction, message));
      if (isPageError || handleAsPageError) {
        setError(handledError);
      }
    },
    [addErrorToast],
  );

  const reloadUsers = useCallback(() => {
    setIsLoading(true);
    setUsers([]);
    const userService = new UserService();
    userService
      .getUsers()
      .then((data) => {
        if (data) setUsers(data);
      })
      .catch((err) => {
        handleError({
          error: err,
          errorAction: `carregar ${entity.namePlural.toLowerCase()}`,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [handleError, entity]);

  const avatarNameBodyTemplate = (rowData: User) => {
    return (
      <AvatarNameContainer
        name={rowData.name}
        avatarUrl={rowData.avatarUrl}
        defaultAvatarIcon="pi pi-user"
        badge={
          rowData.isSuper
            ? { value: 'SUPER', severity: 'info', size: 'small' }
            : undefined
        }
      />
    );
  };

  const organizationsBodyTemplate = (rowData: User) => {
    if (!rowData.organizations || rowData.organizations.length === 0) {
      return <span style={{ fontStyle: 'italic' }}>sem vínculo</span>;
    }
    let { organizations } = rowData;
    let moreOrganizations: string | undefined;

    if (organizations.length > MAX_ORGANIZATIONS_TO_SHOW) {
      moreOrganizations = `+${
        organizations.length - MAX_ORGANIZATIONS_TO_SHOW
      }`;
      organizations = organizations.slice(0, MAX_ORGANIZATIONS_TO_SHOW);
    }

    return (
      <AvatarGroup>
        {organizations.map((org) => {
          return (
            <Avatar
              key={`avatar-${org.id}`}
              className={`avatar-${org.id}`}
              image={org.avatarUrl ? org.avatarUrl : ''}
              icon={!org.avatarUrl ? 'pi pi-briefcase' : ''}
              style={{ backgroundColor: '#efefef', borderRadius: '50%' }}
            />
          );
        })}

        {organizations.map((org) => {
          return (
            <Tooltip
              key={`tooltip-${org.id}`}
              target={`.avatar-${org.id}`}
              content={`${org.name}`}
            />
          );
        })}

        {moreOrganizations && (
          <>
            <Tooltip target=".avatar-more" content={`${moreOrganizations}`} />
            <Avatar
              className="avatar-more"
              label={moreOrganizations}
              style={{ backgroundColor: '#efefef', borderRadius: '50%' }}
            />
          </>
        )}
      </AvatarGroup>
    );
  };

  const normalUserColumns: ColumnProps[] = [
    {
      field: 'name',
      header: 'Nome',
      body: avatarNameBodyTemplate,
      sortable: true,
    },
    { field: 'email', header: 'E-mail', sortable: true },
  ];

  const superUserColumns: ColumnProps[] = [
    ...normalUserColumns,
    {
      field: 'organizations',
      header: 'Organizações',
      body: organizationsBodyTemplate,
    },
  ];

  useEffect(() => {
    setError(undefined);
    reloadUsers();
  }, [selectedOrganization, reloadUsers]);

  const handleConfirmDeleteUser = useCallback(
    (rowData: User): void => {
      if (rowData.id) {
        const organizationService = new UserService();
        organizationService
          .deleteUser(rowData.id)
          .then(() => {
            addToast({
              title: `${entity.name} deletad${
                entity.gender === 'M' ? 'o' : 'a'
              } com Sucesso`,
              type: 'success',
            });
            reloadUsers();
          })
          .catch((err) =>
            handleError({
              error: err,
              errorAction: `deletar ${entity.name.toLowerCase()}`,
            }),
          );
      }
    },
    [addToast, reloadUsers, handleError, entity],
  );

  return (
    <CrudPageContainer
      items={users}
      columns={authUser.isSuper ? superUserColumns : normalUserColumns}
      dataTableRef={dt}
      isLoading={isLoading}
      errorState={error}
      entity={entity}
      handleConfirmDeleteItem={handleConfirmDeleteUser}
      showCreateItemButton
      showItemActionColumn
      // itemActionButtons={[
      //   {
      //     icon: 'pi pi-user',
      //     className: 'p-button-warning',
      //   },
      //   {
      //     icon: 'pi pi-pencil',
      //     className: 'p-button-rounded p-button-success p-mr-2',
      //   },
      //   {
      //     icon: 'pi pi-pencil',
      //     className: 'p-button-rounded p-button-success p-mr-2',
      //   },
      // ]}
    />
  );
};

export default UserPage;
