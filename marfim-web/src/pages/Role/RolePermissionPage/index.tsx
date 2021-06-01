/* eslint-disable react/no-array-index-key */
import { Column, ColumnProps } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
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
import { AvatarNameContainer } from '../../../components/AvatarNameContainer';
import { HandleErrorProps } from '../../../components/CrudPageContainer';
import { IErrorState } from '../../../errors/AppErrorInterfaces';
import { handleAxiosError } from '../../../errors/axiosErrorHandler';
import { roleErrors } from '../../../errors/roleErrors';
import { useAuth } from '../../../hooks/auth';
import { useToast } from '../../../hooks/toast';
import { IPermission, IPermissionGroup, IRole } from '../../../model/Role';
import GenericService from '../../../services/GenericService';
import { Container } from './styles';
import { RolePathParams } from '../RoleFormPage';
import Loading from '../../../components/Loading';
import FormCancelSubmitFooter from '../../../components/FormCancelSubmitFooter';
import api from '../../../services/api';
import ErrorContainer from '../../../components/ErrorContainer';
import { PermissionCheckBoxContainer } from '../../../components/PermissionCheckBoxContainer';

interface roleUserlocationProps {
  role: IRole;
  organizationId: number;
}

const RolePermissionPage: React.FC = () => {
  const [allPermissions, setAllPermissions] = useState<IPermissionGroup[]>([]);
  const [error, setError] = useState<IErrorState | undefined>();
  const [isLoadingAllPermissions, setIsLoadingAllPermissions] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [permissionLevelsColumns, setPermissionLevelsColumns] = useState<
    ColumnProps[]
  >([]);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const history = useHistory();
  const location = useLocation<roleUserlocationProps>();

  const { role, organizationId } = location.state;

  const { id: roleIdStr } = useParams<RolePathParams>();
  const roleId = Number(roleIdStr);

  const dt: React.RefObject<DataTable> = useRef(null);
  const entity = useMemo(() => {
    return {
      name: 'Permissão do Perfil',
      namePlural: 'Permissões do Perfil',
      gender: 'F' as 'M' | 'F',
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

  const onPermissionChange = useCallback(
    (permission: IPermission, checked: boolean) => {
      const tmpAllpermissions = [...allPermissions];
      const groupPermissions = tmpAllpermissions.find(
        (tmpPermission) =>
          tmpPermission.resourceCode === permission.resourceCode,
      );
      if (groupPermissions) {
        groupPermissions.level[permission.levelCode] = !checked;
      }
      setAllPermissions(tmpAllpermissions);
      setIsDirty(true);
    },
    [allPermissions],
  );

  const avatarNameBodyTemplate = (
    name: string,
    icon = 'pi pi-exclamation-circle',
  ) => {
    return (
      <AvatarNameContainer
        name={name}
        defaultAvatarIcon={icon}
        showAvatar
        avatarStyle={{ backgroundColor: 'inherit', marginRight: '-0.5rem' }}
      />
    );
  };

  const reloadAllPermissions = useCallback(() => {
    setIsLoadingAllPermissions(true);
    const service = new GenericService<IPermissionGroup, string>(
      `role/${roleId}/permissions`,
    );
    service
      .findAll()
      .then((data) => {
        if (data) {
          const allPerm = data.flatMap(
            (permissionGroup) => permissionGroup.permissions,
          );
          const allLevels = new Map<
            string,
            { levelCode: string; levelName: string; levelIcon?: string }
          >();
          allPerm.forEach((permission) => {
            allLevels.set(permission.levelCode, {
              levelCode: permission.levelCode,
              levelName: permission.levelName,
              levelIcon: permission.levelIcon,
            });
          });

          const levelColumns: ColumnProps[] = [];
          allLevels.forEach((level) => {
            levelColumns.push({
              header: avatarNameBodyTemplate(level.levelName, level.levelIcon),
              style: { width: '100px' },
              field: `level.${level.levelCode}`,
              body: ({ level: lvl, permissions }: IPermissionGroup) => {
                const show = lvl[`${level.levelCode}`] !== undefined;
                const checked = lvl[`${level.levelCode}`] === true;
                const permission = permissions.find(
                  (perm) => perm.levelCode === level.levelCode,
                );

                return (
                  <PermissionCheckBoxContainer
                    permission={permission}
                    checked={checked}
                    show={show}
                    handleChange={onPermissionChange}
                  />
                );
              },
            });
          });
          setAllPermissions(data);
          setPermissionLevelsColumns([...levelColumns]);
        }
      })
      .catch((err) => {
        handleError({ error: err, errorAction: 'carregar permissões' });
      })
      .finally(() => {
        setIsLoadingAllPermissions(false);
      });
  }, [handleError, onPermissionChange, roleId]);

  useEffect(() => {
    setError(undefined);
    if (isLoadingAllPermissions) {
      reloadAllPermissions();
    }
  }, [reloadAllPermissions, isLoadingAllPermissions]);

  useEffect(() => {
    if (selectedOrganization.id !== organizationId) {
      history.goBack();
    }
  }, [selectedOrganization, history, organizationId]);

  const handleSubmit = useCallback(() => {
    setIsSubmiting(true);
    const rolePermissions = allPermissions.flatMap((permGroup) => {
      return permGroup.permissions.filter(
        (perm) => permGroup.level[`${perm.levelCode}`],
      );
    });
    api
      .patch(`/role/${roleId}/permissions`, rolePermissions)
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
    allPermissions,
    history,
    role.name,
    roleId,
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

  const normalPermissionsColumns: ColumnProps[] = [
    {
      field: 'label',
      header: 'Recurso',
      style: { width: '240px' },
      sortable: true,
      body: ({ label, resourceIcon }: IPermissionGroup) => {
        return avatarNameBodyTemplate(label, resourceIcon);
      },
    },
    ...permissionLevelsColumns,
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
      <Loading isLoading={isLoadingAllPermissions} />
      {!isLoadingAllPermissions && (
        <Card
          title={titleBody}
          subTitle={role.description ? `${role.description}` : null}
          footer={pageCancelSubmitFooter}
        >
          <DataTable
            className="p-datatable-striped p-datatable-gridlines"
            ref={dt}
            value={allPermissions}
            emptyMessage="Nenhuma permissão encontrada"
            dataKey="id"
            globalFilter={globalFilter}
            header={tableHeader}
            autoLayout
            resizableColumns
            scrollable
            scrollHeight="400px"
          >
            {normalPermissionsColumns.map((column, i) => (
              <Column key={`column${i}`} {...column} />
            ))}
          </DataTable>
        </Card>
      )}
    </Container>
  );
};

export default RolePermissionPage;
