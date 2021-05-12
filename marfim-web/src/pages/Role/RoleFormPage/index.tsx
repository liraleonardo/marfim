/* eslint-disable jsx-a11y/label-has-associated-control */
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import { InputSwitch } from 'primereact/inputswitch';
import { AutoComplete, CompleteMethodParams } from 'primereact/autocomplete';
import { useToast } from '../../../hooks/toast';
import { handleAxiosError } from '../../../errors/axiosErrorHandler';
import { IErrorState } from '../../../errors/AppErrorInterfaces';
import CrudFormPageContainer from '../../../components/CrudFormPageContainer';
import { IPermission, IPermissionGroup, IRole } from '../../../model/Role';
import { useAuth } from '../../../hooks/auth';
import { roleErrors } from '../../../errors/roleErrors';
import RoleService from '../../../services/RoleService';
import { IUser } from '../../../model/User';
import '../role-style.css';
import UserService from '../../../services/UserService';
import api from '../../../services/api';

interface OrganizationPathParams {
  id?: string;
}

const RoleFormPage: React.FC = () => {
  const { hasAnyAuthority, selectedOrganization } = useAuth();
  const emptyRole: IRole = {
    name: '',
    description: '',
    isAdmin: false,
    users: [],
    groupedPermissions: [],
  };
  const [isEdit, setIsEdit] = useState(false);
  const [errorState, setErrorState] = useState<IErrorState>();
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState(emptyRole);
  const [roleId, setRoleId] = useState<number | null>(null);

  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

  const [dropdownUsers, setDropdownUsers] = useState<IUser[]>([]);
  const [dropdownPermissions, setDropdownPermissions] = useState<
    IPermissionGroup[]
  >([]);

  const history = useHistory();
  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    control,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      name: role.name,
      description: role.description,
      isAdmin: role.isAdmin,
      users: role.users,
      permissions: role.groupedPermissions?.flatMap(
        (groupedPermission) => groupedPermission.permissions,
      ),
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { id: pathId } = useParams<OrganizationPathParams>();

  const { addToast, addErrorToast } = useToast();

  const entity = useMemo(() => {
    return {
      name: 'Perfil de Acesso',
      namePlural: 'Perfis de Acesso',
      gender: 'M' as 'M' | 'F',
    };
  }, []);

  const handleError = useCallback(
    (error: AxiosError, errorAction: string, handleAsPageError = false) => {
      const handledError = handleAxiosError(error, roleErrors);
      const { messages, isPageError } = handledError;

      messages.forEach((message) => addErrorToast(errorAction, message));
      if (isPageError || handleAsPageError) {
        setErrorState(handledError);
      }
    },
    [addErrorToast],
  );

  useEffect(() => {
    api
      .get<IPermissionGroup[]>('/permission/grouped')
      .then(({ data }) => {
        setDropdownPermissions(data);
      })
      .catch((error) => handleError(error, `carregar permissões`, false))
      .finally(() => {
        setIsPermissionsLoaded(true);
      });
  }, [handleError, hasAnyAuthority, entity.namePlural]);

  useEffect(() => {
    const id = Number(pathId);
    if (id) {
      setIsEdit(true);
      setRoleId(id);
      const roleService = new RoleService();

      if (isPermissionsLoaded) {
        roleService
          .getRole(id)
          .then((response) => {
            setRole(response);

            setValue('name', response.name, { shouldValidate: true });
            setValue('description', response.description, {
              shouldValidate: true,
            });
            setValue('isAdmin', response.isAdmin, {
              shouldValidate: true,
            });
            setValue('users', response.users, { shouldValidate: true });
            if (response.groupedPermissions) {
              const allPermissions = response.groupedPermissions.flatMap(
                (groupedPermissions) => groupedPermissions.permissions,
              );
              setValue('permissions', allPermissions, {
                shouldValidate: true,
              });
            }
          })
          .catch((err) => handleError(err, 'carregar perfil de acesso', true));
      }
    }
  }, [
    pathId,
    setValue,
    handleError,
    isPermissionsLoaded,
    selectedOrganization,
  ]);

  const onInputChange = useCallback(
    (e: { target: { value: string } }, name: string): any => {
      const val = (e.target && e.target.value) || '';
      const updatedRole: any = { ...getValues() };
      updatedRole[`${name}`] = val;

      // console.log(`onChange(): organization.${name}=${val}`);
      setRole(updatedRole);

      return val;
    },
    [getValues],
  );

  const handleCreateSubmit = useCallback(
    (data) => {
      setIsSubmitting(true);
      const roleService = new RoleService();
      const roleToSave = data;

      roleService
        .createRole(roleToSave)
        .then(() => {
          addToast({
            title: 'Perfil de Acesso criado com sucesso',
            type: 'success',
          });
          history.goBack();
        })
        .catch((error: AxiosError) => {
          handleError(error, 'criar Perfil de Acesso');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [addToast, history, handleError],
  );

  const handleEditSubmit = useCallback(
    (data) => {
      setIsSubmitting(true);
      const roleService = new RoleService();
      const roleToSave = data;

      roleToSave.id = roleId;
      roleService
        .updateRole(roleToSave)
        .then(() => {
          addToast({
            title: 'Perfil de Acesso alterado com sucesso',
            type: 'success',
          });
          history.goBack();
        })
        .catch((error: AxiosError) => {
          handleError(error, 'alterar Perfil de Acesso');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [addToast, history, handleError, roleId],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  const permissionsOptionGroupTemplate = (data: IPermissionGroup) => (
    <span className="p-ml-2 p-text-bold">{data.label}</span>
  );
  const permissionItemTemplate = (rowData: IPermission) => {
    return (
      <span
        key={`${rowData.resourceCode}_${rowData.levelCode}`}
        className={`permission-badge level-${rowData.levelCode.toLowerCase()} p-shadow-1`}
      >
        {rowData.levelName} de {rowData.resourceName}
      </span>
    );
  };

  const selectedPermissionItemTemplate = (rowData: any) => {
    if (rowData)
      return (
        <span
          key={`${rowData.resourceCode}_${rowData.levelCode}`}
          className={`p-mr-2 permission-badge level-${rowData.levelCode.toLowerCase()} p-shadow-1`}
        >
          {rowData.levelName} de {rowData.resourceName}
        </span>
      );
    return '';
  };

  const searchUsersByName = useCallback((e: CompleteMethodParams) => {
    if (e.query) {
      const userService = new UserService();
      userService.getUsersByName(e.query).then((usersFound) => {
        setDropdownUsers(usersFound);
      });
    }
  }, []);

  return (
    <CrudFormPageContainer
      isEdit={isEdit}
      entity={entity}
      isDirty={isDirty}
      isValid={isValid}
      isLoading={false}
      isSubmiting={isSubmiting}
      onCancel={handleCancel}
      onSubmitCreate={handleFormSubmit(handleCreateSubmit)}
      onSubmitEdit={handleFormSubmit(handleEditSubmit)}
      errorState={errorState}
    >
      <div className="p-grid">
        <div className="p-field p-col-12 p-md-10">
          <label htmlFor="nameInput">Nome do Perfil *</label>
          <InputText
            {...register('name', {
              required: 'O nome do perfil é obrigatório',
            })}
            type="text"
            id="nameInput"
            value={role.name}
            className={errors.name ? 'p-invalid' : ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = onInputChange(e, 'name');
              setValue('name', val, { shouldValidate: true });
            }}
            tooltip="Informe um nome único para o perfil de acesso"
          />
          {errors?.name && (
            <small id="name-help" className="p-error">
              {errors.name.message}
            </small>
          )}
        </div>
        <div className="p-field-checkbox p-fluid p-col-12 p-md-2">
          <InputSwitch
            {...register('isAdmin')}
            inputId="isAdmin"
            name="isAdmin"
            className={errors.isAdmin ? 'p-invalid' : ''}
            onChange={(e) => {
              setRole({ ...role, isAdmin: e.value });
              setValue('isAdmin', e.value, { shouldValidate: true });
              if (e.value === true) {
                setValue('permissions', []);
              }
            }}
            checked={role.isAdmin}
          />
          <label htmlFor="isAdmin">Administrador</label>
        </div>
        <div className="p-field p-col-12 p-md-12">
          <label htmlFor="descriptionInput">Descrição</label>
          <InputTextarea
            {...register('description')}
            id="descriptionInput"
            value={role.description}
            className={errors.description ? 'p-invalid' : ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              const val = onInputChange(e, 'description');
              setValue('description', val, { shouldValidate: true });
            }}
          />
          {errors?.description && (
            <small id="description-help" className="p-error">
              {errors.description.message}
            </small>
          )}
        </div>
        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="users">Usuários </label>
          <Controller
            name="users"
            control={control}
            render={(props) => (
              <AutoComplete
                id="users"
                name="users"
                value={props.field.value}
                suggestions={dropdownUsers}
                field="name"
                completeMethod={searchUsersByName}
                multiple
                minLength={3}
                className={errors.users ? 'p-invalid' : ''}
                onChange={(e) => {
                  props.field.onChange(e.value);
                }}
                onBlur={(e) => {
                  props.field.onBlur();
                }}
                placeholder="Nenhum usuário selecionado"
              />
            )}
          />
        </div>
        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="permissions">Permissões</label>
          <Controller
            name="permissions"
            control={control}
            render={(props) => (
              <MultiSelect
                id="permissions"
                name="permissions"
                value={props.field.value}
                emptyFilterMessage="Nenhuma permissão encontrada"
                selectedItemsLabel="{0} permissões selecionadas"
                className={errors.permissions ? 'p-invalid' : ''}
                onChange={(e) => {
                  props.field.onChange(e.target.value);
                }}
                options={dropdownPermissions}
                itemTemplate={permissionItemTemplate}
                optionGroupLabel="label"
                optionGroupChildren="permissions"
                optionGroupTemplate={permissionsOptionGroupTemplate}
                selectedItemTemplate={selectedPermissionItemTemplate}
                dataKey="authority"
                placeholder="Nenhuma permissão associada"
                disabled={role.isAdmin}
              />
            )}
          />
        </div>
      </div>
    </CrudFormPageContainer>
  );
};

export default RoleFormPage;
