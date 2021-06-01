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
import { IUser } from '../../../model/User';
import { UserPathParams } from '../UserFormPage';
import Loading from '../../../components/Loading';
import FormCancelSubmitFooter from '../../../components/FormCancelSubmitFooter';
import api from '../../../services/api';
import ErrorContainer from '../../../components/ErrorContainer';
import RoleService from '../../../services/RoleService';

interface UserRolelocationProps {
  user: IUser;
  organizationId: number;
}

const UserRolePage: React.FC = () => {
  const [allRoles, setAllRoles] = useState<IRole[]>([]);
  const [error, setError] = useState<IErrorState | undefined>();
  const [isLoadingAllRoles, setIsLoadingAllRoles] = useState(true);
  const [isLoadingUserRoles, setIsLoadingUserRoles] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<IRole[]>([]);
  const [isToFilterSelectedRoles, setIsToFilterSelectedRoles] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const history = useHistory();
  const location = useLocation<UserRolelocationProps>();

  const { user, organizationId } = location.state;

  const { id: userId } = useParams<UserPathParams>();

  const dt: React.RefObject<DataTable> = useRef(null);
  const entity = useMemo(() => {
    return {
      name: 'Perfil do Usuário',
      namePlural: 'Perfis do Usuário',
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
    setIsLoadingUserRoles(true);
    setSelectedRoles([]);
    const service = new GenericService<IRole, number>(`user/${userId}/roles`);
    service
      .findAll()
      .then((data) => {
        if (data) setSelectedRoles(data);
      })
      .catch((err) => {
        handleError({
          error: err,
          errorAction: `carregar ${entity.namePlural.toLowerCase()}`,
        });
      })
      .finally(() => {
        setIsLoadingUserRoles(false);
      });
  }, [userId, handleError, entity.namePlural]);

  const reloadAllRoles = useCallback(() => {
    setIsLoadingAllRoles(true);
    setAllRoles([]);
    const service = new RoleService();
    service
      .getRoles()
      .then((data) => {
        if (data) {
          setAllRoles(data);
        }
      })
      .catch((err) => {
        handleError({ error: err, errorAction: 'carregar perfis de acesso' });
      })
      .finally(() => {
        setIsLoadingAllRoles(false);
      });
  }, [handleError]);

  useEffect(() => {
    setError(undefined);
    if (isLoadingAllRoles) {
      reloadAllRoles();
    } else {
      reloadRoleUsers();
    }
  }, [reloadAllRoles, isLoadingAllRoles, reloadRoleUsers]);

  useEffect(() => {
    if (selectedOrganization.id !== organizationId) {
      history.goBack();
    }
  }, [selectedOrganization, history, organizationId]);

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

  const handleSubmit = useCallback(() => {
    setIsSubmiting(true);
    api
      .patch(`/user/${userId}/roles`, selectedRoles)
      .then(() => {
        addToast({
          type: 'success',
          title: `${entity.namePlural} '${user.name}' salv${
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
  }, [addToast, handleError, history, user, userId, selectedRoles, entity]);

  const tableHeader = (
    <div className="table-header">
      <h5 className="p-m-0">Gerenciar {entity.namePlural}</h5>
      <div className="p-grid p-ai-baseline">
        <div className="p-field-checkbox">
          <span className="p-mr-1">Filtrar Selecionados</span>
          <InputSwitch
            onChange={(e) => {
              setIsToFilterSelectedRoles(e.value);
              if (dt.current) {
                dt.current.filter(e.value, 'id', 'custom');
              }
            }}
            checked={isToFilterSelectedRoles}
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
  const handleFilterSelectedRoles = (value: any, filter: any) => {
    return (
      !filter || selectedRoles.find((selectedUser) => selectedUser.id === value)
    );
  };

  const normalUserColumns: ColumnProps[] = [
    {
      selectionMode: 'multiple',
      headerStyle: { width: '3rem' },
      filterMatchMode: 'custom',
      filterFunction: (value, filter) =>
        handleFilterSelectedRoles(value, filter),
      field: 'id',
    },
    {
      field: 'name',
      header: 'Nome',
      body: roleNameBodyTemplate,
      sortable: true,
    },
    { field: 'description', header: 'Descrição', sortable: true },
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
    setSelectedRoles(e.value);
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
      <Loading isLoading={isLoadingAllRoles} />
      {!isLoadingAllRoles && (
        <Card
          title={`Usuário: ${user.name}`}
          subTitle={user.email ? `${user.email}` : null}
          footer={pageCancelSubmitFooter}
        >
          <DataTable
            className="p-datatable-striped p-datatable-gridlines"
            ref={dt}
            value={allRoles}
            emptyMessage="Nenhum usuário encontrado"
            dataKey="id"
            globalFilter={globalFilter}
            header={tableHeader}
            selection={selectedRoles}
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

export default UserRolePage;
