/* eslint-disable react/no-array-index-key */
import { Column, ColumnProps } from 'primereact/column';
import { DataTable, SelectionChangeParams } from 'primereact/datatable';
import { Card } from 'primereact/card';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { SeverityType } from 'primereact/messages';
import { BadgeProps, SizeType } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { AvatarNameContainer } from '../../../components/AvatarNameContainer';
import { HandleErrorProps } from '../../../components/CrudPageContainer';
import { IErrorState } from '../../../errors/AppErrorInterfaces';
import { handleAxiosError } from '../../../errors/axiosErrorHandler';
import { roleErrors } from '../../../errors/roleErrors';
import { useAuth } from '../../../hooks/auth';
import { useToast } from '../../../hooks/toast';
import { IRole } from '../../../model/Role';
import GenericService from '../../../services/GenericService';
import { Container } from './styles';
// import '../role-style.css';
import { IUser } from '../../../model/User';
import { RolePathParams } from '../RoleFormPage';
import Loading from '../../../components/Loading';
import FormCancelSubmitFooter from '../../../components/FormCancelSubmitFooter';
import api from '../../../services/api';
import ErrorContainer from '../../../components/ErrorContainer';

interface RoleUserlocationProps {
  role: IRole;
  organizationId: number;
}

const RoleUserPage: React.FC = () => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [error, setError] = useState<IErrorState | undefined>();
  const [isLoadingAllUsers, setIsLoadingAllUsers] = useState(true);
  const [isLoadingRoleUsers, setIsLoadingRoleUsers] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [isToFilterSelectedUsers, setIsToFilterSelectedUsers] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const history = useHistory();
  const location = useLocation<RoleUserlocationProps>();

  const { role, organizationId } = location.state;

  const { id: roleIdStr } = useParams<RolePathParams>();
  const roleId = Number(roleIdStr);

  const dt: React.RefObject<DataTable> = useRef(null);
  const entity = useMemo(() => {
    return {
      name: 'Usuário do Perfil',
      namePlural: 'Usuários do Perfil',
      gender: 'M' as 'M' | 'F',
    };
  }, []);

  const { addErrorToast, addToast } = useToast();
  const { selectedOrganization, signOut } = useAuth();

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

  const reloadRoleUsers = useCallback(() => {
    setIsLoadingRoleUsers(true);
    setSelectedUsers([]);
    const service = new GenericService<IUser, string>(`role/${roleId}/users`);
    service
      .findAll()
      .then((data) => {
        if (data) setSelectedUsers(data);
      })
      .catch((err) => {
        handleError({
          error: err,
          errorAction: `carregar ${entity.namePlural.toLowerCase()}`,
        });
      })
      .finally(() => {
        setIsLoadingRoleUsers(false);
      });
  }, [roleId, handleError, entity.namePlural]);

  const reloadAllUsers = useCallback(() => {
    setIsLoadingAllUsers(true);
    setAllUsers([]);
    const service = new GenericService<IUser, string>(`organization/user`);
    service
      .findAll()
      .then((data) => {
        if (data) {
          setAllUsers(data);
        }
      })
      .catch((err) => {
        handleError({ error: err, errorAction: 'carregar usuários' });
      })
      .finally(() => {
        setIsLoadingAllUsers(false);
      });
  }, [handleError]);

  useEffect(() => {
    setError(undefined);
    if (isLoadingAllUsers) {
      reloadAllUsers();
    } else {
      reloadRoleUsers();
    }
  }, [reloadAllUsers, isLoadingAllUsers, reloadRoleUsers]);

  useEffect(() => {
    if (selectedOrganization.id !== organizationId) {
      history.goBack();
    }
  }, [selectedOrganization, history, organizationId]);

  const avatarNameBodyTemplate = (rowData: IUser) => {
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

  const handleSubmit = useCallback(() => {
    setIsSubmiting(true);
    api
      .patch(`/role/${roleId}/users`, selectedUsers)
      .then(() => {
        addToast({
          type: 'success',
          title: `${entity.namePlural} '${role.name}' salv${
            entity.gender === 'F' ? 'a' : 'o'
          }s com sucesso`,
        });
        history.goBack();
      })
      .catch((err) => {
        handleError({
          error: err,
          errorAction: `salvar ${entity.namePlural.toLowerCase()}`,
        });
      })
      .finally(() => {
        setIsSubmiting(false);
      });
  }, [
    addToast,
    handleError,
    history,
    role.name,
    roleId,
    selectedUsers,
    entity,
  ]);

  const titleBody = (
    <div className="p-d-flex p-ai-baseline">
      <h5 className="p-mr-2 p-mb-0">Perfil de Acesso:</h5>
      <AvatarNameContainer
        name={`${role.name}`}
        defaultAvatarIcon="pi pi-lock"
        showAvatar={false}
        badge={
          role.isAdmin ? { value: 'ADMIN', severity: 'success' } : undefined
        }
      />
    </div>
  );

  const tableHeader = (
    <div className="table-header">
      <h5 className="p-m-0">Gerenciar {entity.namePlural}</h5>
      <div className="p-grid p-ai-baseline">
        <div className="p-field-checkbox">
          <span className="p-mr-1">Filtrar Selecionados</span>
          <InputSwitch
            onChange={(e) => {
              setIsToFilterSelectedUsers(e.value);
              if (dt.current) {
                dt.current.filter(e.value, 'id', 'custom');
              }
            }}
            checked={isToFilterSelectedUsers}
            className="p-mr-3"
          />
        </div>

        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              const search = e.target.value;
              setGlobalFilter(search);
            }}
            placeholder="Buscar..."
          />
        </span>
      </div>
    </div>
  );
  const handleFilterSelectedUsers = (value: any, filter: any) => {
    return (
      !filter || selectedUsers.find((selectedUser) => selectedUser.id === value)
    );
  };

  const normalUserColumns: ColumnProps[] = [
    {
      selectionMode: 'multiple',
      headerStyle: { width: '3rem' },
      filterMatchMode: 'custom',
      filterFunction: (value, filter) =>
        handleFilterSelectedUsers(value, filter),
      field: 'id',
    },
    {
      field: 'name',
      header: 'Nome',
      body: avatarNameBodyTemplate,
      sortable: true,
    },
    { field: 'email', header: 'E-mail', sortable: true },
  ];

  const pageCancelSubmitFooter = () => {
    return (
      <FormCancelSubmitFooter
        submitDisabled={!isDirty || isSubmiting}
        onSubmitClick={handleSubmit}
        onCancelClick={() => history.goBack()}
      />
    );
  };

  const onSelectionChange = (e: SelectionChangeParams) => {
    setSelectedUsers(e.value);
    if (!isDirty) {
      setIsDirty(true);
    }
  };

  const handleErrorButtonCLick = useCallback(() => {
    if (error && error.status.toString() === '401') {
      signOut();
    }
    history.push('/');
  }, [history, signOut, error]);

  if (error) {
    return (
      <ErrorContainer
        status={error.status}
        title={error.title}
        messages={error.messages}
        buttonLabel={error.status === 401 ? 'Refazer login' : undefined}
        onButtonClick={handleErrorButtonCLick}
      />
    );
  }

  return (
    <Container className="datatable crud-demo">
      <Loading isLoading={isLoadingAllUsers} />
      {!isLoadingAllUsers && (
        <Card
          title={titleBody}
          subTitle={role.description ? `${role.description}` : null}
          footer={pageCancelSubmitFooter}
        >
          <DataTable
            className="p-datatable-striped p-datatable-gridlines"
            ref={dt}
            value={allUsers}
            emptyMessage="Nenhum usuário encontrado"
            dataKey="id"
            globalFilter={globalFilter}
            header={tableHeader}
            selection={selectedUsers}
            onSelectionChange={onSelectionChange}
            autoLayout
            resizableColumns
            paginator
            rows={10}
            rowsPerPageOptions={[10, 30, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate={`Exibindo {first} a {last} de {totalRecords} ${entity.namePlural.toLowerCase()}`}
          >
            {normalUserColumns.map((column, i) => (
              <Column key={`column${i}`} {...column} />
            ))}
          </DataTable>
        </Card>
      )}
    </Container>
  );
};

export default RoleUserPage;
