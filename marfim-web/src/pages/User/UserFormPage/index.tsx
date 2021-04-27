/* eslint-disable jsx-a11y/label-has-associated-control */
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/toast';

import { organizationErrors } from '../../../errors/organizationErrors';
import { handleAxiosError } from '../../../errors/axiosErrorHandler';
import { IErrorState } from '../../../errors/AppErrorInterfaces';
import CrudFormPageContainer from '../../../components/CrudFormPageContainer';
import User, { ICreateUpdateUser } from '../../../model/User';
import UserService from '../../../services/UserService';

interface UserPathParams {
  id?: string;
}

interface MyTarget extends EventTarget {
  value?: string;
}

const UserFormPage: React.FC = () => {
  const emptyUser: ICreateUpdateUser = new User();
  const [isEdit, setIsEdit] = useState(false);

  const [errorState, setErrorState] = useState<IErrorState>();
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [userId, setUserId] = useState<string | null>(null);

  const history = useHistory();
  const location = useLocation();
  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    getValues,
    control,
    formState,
    formState: { errors, isDirty, isValid, touchedFields },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: isEdit ? 'default' : '',
      isSuper: user.isSuper,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const entity = useMemo(() => {
    return {
      name: 'Usuário',
      namePlural: 'Usuários',
      gender: 'M' as 'M' | 'F',
    };
  }, []);

  const { id: pathId } = useParams<UserPathParams>();

  const { addToast, addErrorToast } = useToast();

  const handleError = useCallback(
    (error: AxiosError, errorAction: string, handleAsPageError = false) => {
      const handledError = handleAxiosError(error, organizationErrors);
      const { messages, isPageError } = handledError;

      messages.forEach((message) => addErrorToast(errorAction, message));
      if (isPageError || handleAsPageError) {
        setErrorState(handledError);
      }
    },
    [addErrorToast],
  );

  useEffect(() => {
    const id = pathId;
    if (id) {
      setIsEdit(true);
      setUserId(id);
      const userService: UserService = new UserService();

      userService
        .getUser(id)
        .then((response) => {
          response.avatarUrl = !response.avatarUrl ? '' : response.avatarUrl;
          return response;
        })
        .then((response) => {
          const { email, name, password, isSuper } = response;
          setUser({ email, name, password: 'default', isSuper });

          setValue('name', response.name, { shouldValidate: true });
          setValue('email', response.email, {
            shouldValidate: true,
          });
          setValue('password', response.password || 'default', {
            shouldValidate: true,
          });
          setValue('isSuper', response.isSuper, { shouldValidate: true });
        })
        .catch((error) => {
          handleError(error, 'carregar usuários', true);
        });
    }
  }, [location.pathname, pathId, history, setValue, handleError]);

  const onInputChange = useCallback(
    (e: { target: MyTarget }, name: string): any => {
      const val = (e.target && e.target.value) || '';
      const updatedUser: any = { ...getValues() };
      updatedUser[`${name}`] = val;

      // console.log(`onChange(): organization.${name}=${val}`);
      setUser(updatedUser);

      return val;
    },
    [getValues],
  );

  const handleCreateSubmit = useCallback(
    (data) => {
      setIsSubmitting(true);
      const userService = new UserService();
      const userToSave = data;

      userService
        .createUser(userToSave)
        .then(() => {
          addToast({
            title: 'Usuário criado com sucesso',
            type: 'success',
          });
          history.goBack();
        })
        .catch((error: AxiosError) => {
          handleError(error, 'criar Organização');
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
      const userService = new UserService();
      const userToSave = data;

      userToSave.id = userId;
      userService
        .updateUser(userToSave)
        .then(() => {
          addToast({
            title: 'Usuário alterado com sucesso',
            type: 'success',
          });
          history.goBack();
        })
        .catch((error: AxiosError) => {
          // console.error(error.response?.data.message);
          handleError(error, 'alterar Organização');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [addToast, history, handleError, userId],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  const passwordHeader = <h6>Escolha uma senha</h6>;
  const passwordFooter = (
    <>
      <Divider />
      <p className="p-mt-2">Sugestões</p>
      <ul className="p-pl-2 p-ml-2 p-mt-0" style={{ lineHeight: '1.5' }}>
        <li>Pelo menos uma letra minúscula</li>
        <li>Pelo menos uma letra maiúscula</li>
        <li>Pelo menos um número</li>
        <li>Pelo menos 8 caracteres</li>
      </ul>
    </>
  );
  const checkToCleanUserPassword = useCallback(() => {
    if (user.password === 'default') {
      user.password = '';
      setValue('password', '');
    }
  }, [user, setValue]);

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
      <div className="p-field p-col-12 p-md-8">
        <label htmlFor="nameInput">Nome *</label>
        <InputText
          {...register('name', {
            required: 'O nome do usuário é obrigatório',
          })}
          type="text"
          id="nameInput"
          value={user.name}
          className={errors.name ? 'p-invalid' : ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const val = onInputChange(e, 'name');
            setValue('name', val, { shouldValidate: true });
          }}
          // tooltip="Informe um nome único para a organização"
        />
        {errors?.name && (
          <small id="name-help" className="p-error">
            {errors.name.message}
          </small>
        )}
      </div>
      <div className="p-field p-col-12 p-md-4">
        <label htmlFor="passwordInput">Senha *</label>
        <Controller
          name="password"
          control={control}
          render={(props) => (
            <Password
              {...register('password', {
                required: 'A senha do usuário é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha precisa ter pelo menos 6 dígitos',
                },
              })}
              id="password"
              name="password"
              value={props.field.value}
              className={errors.password ? 'p-invalid' : ''}
              onChange={(e) => {
                props.field.onChange(e.target.value);
              }}
              onBlur={(e) => {
                setValue('password', e.target.value, { shouldValidate: true });
              }}
              toggleMask={!props.field.value}
              weakLabel="Fraca"
              mediumLabel="Normal"
              strongLabel="Forte"
              promptLabel="Informe uma senha com pelo menos 6 dígitos"
              header={passwordHeader}
              footer={passwordFooter}
              onShow={checkToCleanUserPassword}
            />
          )}
        />
        {errors?.password && (
          <small id="cnpj-help" className="p-error">
            {errors.password.message}
          </small>
        )}
      </div>

      <div className="p-field p-col-12 p-md-12">
        <label htmlFor="emailInput">E-mail *</label>
        <InputText
          {...register('email', {
            required: 'O e-mail do usuário é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Endereço de e-mail inválido. Ex. usuario@email.com',
            },
          })}
          type="text"
          id="emailInput"
          value={user.email}
          className={errors.email ? 'p-invalid' : ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const val = onInputChange(e, 'email');
            setValue('email', val, { shouldValidate: true });
          }}
        />
        {errors?.email && (
          <small id="email-help" className="p-error">
            {errors.email.message}
          </small>
        )}
      </div>
    </CrudFormPageContainer>
  );
};

export default UserFormPage;
