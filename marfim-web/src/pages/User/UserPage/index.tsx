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
import { ColumnProps } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useHistory } from 'react-router-dom';
import CrudPageContainer, {
  HandleErrorProps,
} from '../../../components/CrudPageContainer';
import { useAuth } from '../../../hooks/auth';
import { AvatarNameContainer } from '../../../components/AvatarNameContainer';
import { handleAxiosError } from '../../../errors/axiosErrorHandler';
import { useToast } from '../../../hooks/toast';
import { IErrorState } from '../../../errors/AppErrorInterfaces';
import UserService from '../../../services/UserService';
import User, { IUser } from '../../../model/User';
import Organization from '../../../model/Organization';
import OrganizationService from '../../../services/OrganizationService';
import api from '../../../services/api';
import { userErrors } from '../../../errors/userErrors';
import { IRole } from '../../../model/Role';
import RoleService from '../../../services/RoleService';

const UserPage: React.FC = () => {
  const dt: React.RefObject<DataTable> = useRef(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<IErrorState | undefined>();
  const [organizationsToFilter, setOrganizationsToFilter] = useState<
    Organization[]
  >([]);
  const [rolesToFilter, setRolesToFilter] = useState<IRole[]>([]);
  const defaultOrganizationOption: Organization = useMemo(() => {
    return {
      id: -1,
      name: 'sem vínculo',
      cnpj: '',
    };
  }, []);
  const defaultRoleOption: IRole = useMemo(() => {
    return {
      id: -1,
      name: 'sem perfis de acesso',
    };
  }, []);
  const [organizationsOptions, setOrganizationsOptions] = useState<
    Organization[]
  >([defaultOrganizationOption]);
  const [rolesOptions, setRolesOptions] = useState<IRole[]>([
    defaultRoleOption,
  ]);
  const [loadedOrganizations, setLoadedOrganizations] = useState(false);
  const [loadedRoles, setLoadedRoles] = useState(false);
  const [
    showLinkUserOrganizationDialog,
    setShowLinkUserOrganizationDialog,
  ] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [userToBeLinked, setUserToBeLinked] = useState<User | undefined>(
    undefined,
  );

  const { selectedOrganization, user: authUser, hasAnyAuthority } = useAuth();
  const { addErrorToast, addToast } = useToast();
  const history = useHistory();
  const MAX_ORGANIZATIONS_TO_SHOW = 5;
  const MAX_ROLES_TO_SHOW = 5;

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
      const handledError = handleAxiosError(err, userErrors);
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

  const loadRoles = useCallback(() => {
    setLoadedRoles(false);

    const roleService = new RoleService();
    roleService
      .getRoles(hasAnyAuthority(['ROLE_SUPER_USER']))
      .then((data) => {
        if (data) setRolesOptions([defaultRoleOption, ...data]);
      })
      .catch((err) => {
        handleError({
          error: err,
          errorAction: `carregar perfis de acesso`,
        });
      })
      .finally(() => {
        setLoadedRoles(true);
      });
  }, [handleError, defaultRoleOption, hasAnyAuthority]);

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
        key={rowData.id}
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
              position="top"
            />
          );
        })}

        {moreOrganizations && (
          <>
            <Tooltip
              target=".avatar-more"
              content={`${moreOrganizations}`}
              position="top"
            />
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

  const rolesBodyTemplate = (rowData: User) => {
    if (!rowData.roles || rowData.roles.length === 0) {
      return <span style={{ fontStyle: 'italic' }}>sem perfil de acesso</span>;
    }
    let { roles } = rowData;
    let moreRoles: string | undefined;

    if (roles.length > MAX_ROLES_TO_SHOW) {
      moreRoles = `+${roles.length - MAX_ROLES_TO_SHOW}`;
      roles = roles.slice(0, MAX_ROLES_TO_SHOW);
    }

    return (
      <AvatarGroup>
        {roles.map((role) => {
          return (
            <Avatar
              key={`avatar-role-${role.id}`}
              className={`avatar-role-${role.id}`}
              icon="pi pi-unlock"
              style={{ backgroundColor: '#efefef', borderRadius: '50%' }}
            />
          );
        })}

        {roles.map((role) => {
          return (
            <Tooltip
              key={`tooltip-role-${role.id}`}
              target={`.avatar-role-${role.id}`}
              content={`${role.name}\n(${role.organization?.name})`}
              position="top"
            />
          );
        })}

        {moreRoles && (
          <>
            <Tooltip
              target=".avatar-role-more"
              content={`${moreRoles}`}
              position="top"
            />
            <Avatar
              className="avatar-role-more"
              label={moreRoles}
              style={{ backgroundColor: '#efefef', borderRadius: '50%' }}
            />
          </>
        )}
      </AvatarGroup>
    );
  };

  const onOrganizationsChange = useCallback((value: Organization[]): void => {
    setOrganizationsToFilter(value);
    if (dt.current) {
      dt.current.filter(value, 'organizations', 'custom');
    }
  }, []);

  const onRolesChange = useCallback((value: IRole[]): void => {
    setRolesToFilter(value);
    if (dt.current) {
      dt.current.filter(value, 'roles', 'custom');
    }
  }, []);

  const rolesFilterItemTemplate = (item: IRole) => {
    if (item) {
      let itemLabel = `${item.name}`;
      if (
        hasAnyAuthority(['ROLE_SUPER_USER']) &&
        item.organization &&
        item.organization.name
      ) {
        itemLabel += ` - ${item.organization?.name}`;
      }
      return itemLabel;
    }
    return undefined;
  };

  const rolesFilter = (
    <MultiSelect
      value={rolesToFilter}
      itemTemplate={rolesFilterItemTemplate}
      selectedItemTemplate={rolesFilterItemTemplate}
      options={rolesOptions}
      onChange={(e) => onRolesChange(e.value)}
      optionLabel="name"
      placeholder="Buscar por perfis de acesso"
      showClear
      emptyFilterMessage="Nenhum perfil de acesso encontrado"
      selectedItemsLabel="{0} perfis selecionados"
      maxSelectedLabels={2}
    />
  );

  const organizationsFilter = (
    <MultiSelect
      value={organizationsToFilter}
      options={organizationsOptions}
      onChange={(e) => onOrganizationsChange(e.value)}
      optionLabel="name"
      placeholder="Buscar por organizações"
      showClear
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

  const filterByRole = (value: any, filter: any) => {
    const roleValue = value as IRole[];
    const roleFilter = filter as IRole[];
    return (
      roleFilter.filter((f) => {
        if (f.id === defaultRoleOption.id && roleValue.length === 0) {
          return true;
        }
        return (
          f.id !== defaultRoleOption.id &&
          roleValue.findIndex((v) => v.id === f.id) !== -1
        );
      }).length > 0
    );
  };

  const columns = () => {
    const normalUserColumns: ColumnProps[] = [
      {
        field: 'name',
        header: 'Nome',
        body: avatarNameBodyTemplate,
        sortable: true,
      },
      { field: 'email', header: 'E-mail', sortable: true },
    ];

    const adminUserColumns: ColumnProps[] = [
      ...normalUserColumns,
      {
        field: 'roles',
        header: 'Perfis de Acesso',
        filter: true,
        filterMatchMode: 'custom',
        filterElement: rolesFilter,
        filterFunction: (value, filter) => filterByRole(value, filter),
        body: rolesBodyTemplate,
      },
    ];

    const superUserColumns: ColumnProps[] = [
      ...adminUserColumns,
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

    if (hasAnyAuthority(['ROLE_SUPER_USER'])) {
      return superUserColumns;
    }
    if (hasAnyAuthority(['ROLE_ADMIN_USER'])) {
      return adminUserColumns;
    }
    return normalUserColumns;
  };

  useEffect(() => {
    setError(undefined);
    if (!loadedOrganizations && authUser.isSuper) {
      loadOrganizations();
    }
    if (
      !loadedRoles &&
      hasAnyAuthority(['ROLE_SUPER_USER', 'ROLE_ADMIN_USER'])
    ) {
      loadRoles();
    }
    reloadUsers();
  }, [
    selectedOrganization,
    reloadUsers,
    loadedOrganizations,
    loadedRoles,
    authUser.isSuper,
    loadOrganizations,
    loadRoles,
    hasAnyAuthority,
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

  const showDialog = useCallback(() => {
    setShowLinkUserOrganizationDialog(true);
  }, []);

  const hideDialog = useCallback(() => {
    setShowLinkUserOrganizationDialog(false);
    setUserToBeLinked(undefined);
    setUserEmail('');
  }, []);

  const linkUserWithOrganizationButton = (
    <Button
      label={`Associar ${entity.name}`}
      icon="pi pi-link"
      className="p-button-info p-mr-2 p-ml-4"
      onClick={showDialog}
    />
  );

  const handleDialogSubmit = useCallback(() => {
    if (userToBeLinked) {
      api
        .patch(`organization/user/${userToBeLinked.id}/link`)
        .then(() => {
          addToast({
            type: 'success',
            title: `Usuário associado com a organização ${selectedOrganization.name}`,
          });
          hideDialog();
          reloadUsers();
        })
        .catch((err) =>
          handleError({
            error: err,
            errorAction: `associar ${entity.name.toLowerCase()}`,
          }),
        );
    }
  }, [
    selectedOrganization.name,
    userToBeLinked,
    entity.name,
    addToast,
    handleError,
    hideDialog,
    reloadUsers,
  ]);

  const dialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        disabled={!userToBeLinked}
        label="Associar"
        icon="pi pi-check"
        className="p-button"
        onClick={handleDialogSubmit}
      />
    </>
  );

  const findUserByEmail = useCallback(() => {
    setUserToBeLinked(undefined);
    api
      .get('organization/user/unlinked', { params: { email: userEmail } })
      .then((response) => setUserToBeLinked(response.data as User))
      .catch((err) =>
        handleError({
          error: err,
          errorAction: `buscar ${entity.name.toLowerCase()}`,
        }),
      );
  }, [userEmail, handleError, entity.name]);

  const userRolesExtraActionBody = (data: IUser) => {
    if (hasAnyAuthority(['ROLE_SUPER_USER', 'ROLE_ADMIN_USER'])) {
      return (
        <Button
          icon="pi pi-unlock"
          className="p-button-rounded p-button-info"
          onClick={() => {
            if (
              data.organizations?.some(
                (org) => org.id === selectedOrganization.id,
              )
            ) {
              history.push(`/users/${data.id}/roles`, {
                user: data,
                organizationId: selectedOrganization.id,
              });
            } else {
              addErrorToast(
                'carregar perfis de acesso',
                `Usuário não pertence a esta organização (logado em '${selectedOrganization.name}')`,
              );
            }
          }}
          tooltip="Perfis de Acesso"
        />
      );
    }
    return null;
  };

  return (
    <div>
      <CrudPageContainer
        items={users}
        columns={columns()}
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
        customButtonsContent={linkUserWithOrganizationButton}
        showCustomButtonsOnHeaderForAuthorities={[
          'USERS_ALL',
          'ROLE_ADMIN_USER',
          'ORGANIZATION_USERS_ASSOCIATE',
        ]}
        itemActionExtraBody={userRolesExtraActionBody}
      />
      <Dialog
        visible={showLinkUserOrganizationDialog}
        style={{ width: '450px' }}
        header="Associar usuário com esta organização"
        modal
        className="p-fluid"
        footer={dialogFooter}
        onHide={hideDialog}
        focusOnShow={false}
      >
        <div className="p-inputgroup">
          <InputText
            placeholder="Buscar usuário por e-mail ..."
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <Button label="Buscar" onClick={findUserByEmail} />
        </div>
        {userToBeLinked && (
          <div className="p-mt-4">
            <AvatarNameContainer
              name={userToBeLinked.name}
              defaultAvatarIcon="pi pi-user"
              avatarUrl={userToBeLinked.avatarUrl}
            />
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default UserPage;
