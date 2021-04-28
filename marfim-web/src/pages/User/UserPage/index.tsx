import { DataTable } from 'primereact/datatable';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BadgeProps, SeverityType, SizeType } from 'primereact/badge';
import { AvatarGroup } from 'primereact/avatargroup';
import { Avatar } from 'primereact/avatar';
import { Tooltip } from 'primereact/tooltip';
import { ColumnProps, FilterParams } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import CrudPageContainer, {
  HandleErrorProps,
} from '../../../components/CrudPageContainer';
import { useAuth } from '../../../hooks/auth';
import { AvatarNameContainer } from '../../../components/AvatarNameContainer';
import { handleAxiosError } from '../../../errors/axiosErrorHandler';
import { useToast } from '../../../hooks/toast';
import { IErrorState } from '../../../errors/AppErrorInterfaces';
import UserService from '../../../services/UserService';
import User from '../../../model/User';
import Organization from '../../../model/Organization';
import OrganizationService from '../../../services/OrganizationService';

const UserPage: React.FC = () => {
  const dt: React.RefObject<DataTable> = useRef(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<IErrorState | undefined>();
  const [organizationsToFilter, setOrganizationsToFilter] = useState<
    Organization[]
  >([]);
  const defaultOrganizationOption: Organization = useMemo(() => {
    return {
      id: -1,
      name: 'sem vínculo',
      cnpj: '',
    };
  }, []);
  const [organizationsOptions, setOrganizationsOptions] = useState<
    Organization[]
  >([defaultOrganizationOption]);
  const [loadedOrganizations, setLoadedOrganizations] = useState(false);

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

  const loadOrganizations = useCallback(() => {
    setLoadedOrganizations(false);

    const organizationService = new OrganizationService();
    organizationService
      .getOrganizations()
      .then((data) => {
        if (data) setOrganizationsOptions([defaultOrganizationOption, ...data]);
      })
      .catch((err) => {
        handleError({
          error: err,
          errorAction: `carregar Organizações`,
        });
      })
      .finally(() => {
        setLoadedOrganizations(true);
      });
  }, [handleError, defaultOrganizationOption]);

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
            ? ({
                value: 'SUPER',
                severity: 'info' as SeverityType,
                size: 'small' as SizeType,
              } as BadgeProps)
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

  const onOrganizationsChange = useCallback((value: any): void => {
    setOrganizationsToFilter(value);
    if (dt.current) {
      dt.current.filter(value, 'organizations', 'custom');
    }
  }, []);

  const organizationsFilter = (
    <MultiSelect
      value={organizationsToFilter}
      options={organizationsOptions}
      onChange={(e) => onOrganizationsChange(e.value)}
      optionLabel="name"
      placeholder="Buscar por organizações"
      showClear
      // display="chip"
      emptyFilterMessage="Nenhuma organização encontrada"
      selectedItemsLabel="{0} organizações selecionadas"
      maxSelectedLabels={2}
    />
  );

  const filterByOrganization = (value: any, filter: any) => {
    const orgValue = value as Organization[];
    const orgFilter = filter as Organization[];
    return (
      orgFilter.filter((f) => {
        if (f.id === defaultOrganizationOption.id && orgValue.length === 0) {
          return true;
        }
        return (
          f.id !== defaultOrganizationOption.id &&
          orgValue.findIndex((v) => v.id === f.id) !== -1
        );
      }).length > 0
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
      filter: true,
      filterMatchMode: 'custom',
      filterElement: organizationsFilter,
      filterFunction: (value, filter) => filterByOrganization(value, filter),
      body: organizationsBodyTemplate,
    },
  ];

  useEffect(() => {
    setError(undefined);
    if (!loadedOrganizations && authUser.isSuper) {
      loadOrganizations();
    }
    reloadUsers();
  }, [
    selectedOrganization,
    reloadUsers,
    loadedOrganizations,
    authUser.isSuper,
    loadOrganizations,
  ]);

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
              errorAction: `apagar ${entity.name.toLowerCase()}`,
            }),
          );
      }
    },
    [addToast, reloadUsers, handleError, entity],
  );

  const fullAccessForAuthoritiesList = [
    'USERS_ALL',
    'ROLE_SUPER_USER',
    'ROLE_ADMIN_USER',
  ];

  return (
    <CrudPageContainer
      items={users}
      columns={authUser.isSuper ? superUserColumns : normalUserColumns}
      dataTableRef={dt}
      isLoading={isLoading}
      errorState={error}
      entity={entity}
      handleConfirmDeleteItem={handleConfirmDeleteUser}
      showItemActionColumn
      showCreateItemButtonForAuthorities={[
        'USERS_CREATE',
        ...fullAccessForAuthoritiesList,
      ]}
      showEditActionForAuthorities={[
        'USERS_UPDATE',
        ...fullAccessForAuthoritiesList,
      ]}
      showDeleteActionForAuthorities={[
        'USERS_DELETE',
        ...fullAccessForAuthoritiesList,
      ]}
    />
  );
};

export default UserPage;
