/* eslint-disable jsx-a11y/label-has-associated-control */
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
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
import { InputSwitch } from 'primereact/inputswitch';
import { useToast } from '../../../hooks/toast';
import { handleAxiosError } from '../../../errors/axiosErrorHandler';
import { IErrorState } from '../../../errors/AppErrorInterfaces';
import CrudFormPageContainer from '../../../components/CrudFormPageContainer';
import { IRole } from '../../../model/Role';
import { useAuth } from '../../../hooks/auth';
import { roleErrors } from '../../../errors/roleErrors';
import RoleService from '../../../services/RoleService';

export interface RolePathParams {
  id?: string;
}

const RoleFormPage: React.FC = () => {
  const { selectedOrganization } = useAuth();
  const emptyRole: IRole = {
    name: '',
    description: '',
    isAdmin: false,
  };
  const [isEdit, setIsEdit] = useState(false);
  const [errorState, setErrorState] = useState<IErrorState>();
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState(emptyRole);
  const [roleId, setRoleId] = useState<number | null>(null);

  const history = useHistory();
  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      name: role.name,
      description: role.description,
      isAdmin: role.isAdmin,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { id: pathId } = useParams<RolePathParams>();

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
    const id = Number(pathId);
    if (id) {
      setIsEdit(true);
      setRoleId(id);
      const roleService = new RoleService();

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
        })
        .catch((err) => handleError(err, 'carregar perfil de acesso', true));
    }
  }, [pathId, setValue, handleError, selectedOrganization]);

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
      </div>
    </CrudFormPageContainer>
  );
};

export default RoleFormPage;
