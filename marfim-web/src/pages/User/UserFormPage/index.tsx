/* eslint-disable jsx-a11y/label-has-associated-control */
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { InputSwitch } from 'primereact/inputswitch';
import { Divider } from 'primereact/divider';
import { Fieldset } from 'primereact/fieldset';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import { useToast } from '../../../hooks/toast';

import { userErrors } from '../../../errors/userErrors';
import { handleAxiosError } from '../../../errors/axiosErrorHandler';
import { IErrorState } from '../../../errors/AppErrorInterfaces';
import CrudFormPageContainer from '../../../components/CrudFormPageContainer';
import User, { ICreateUpdateUser } from '../../../model/User';
import UserService from '../../../services/UserService';
import OrganizationService from '../../../services/OrganizationService';
import Organization from '../../../model/Organization';
import { useAuth } from '../../../hooks/auth';

export interface UserPathParams {
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
  const [dropdownOrganizations, setDropdownOrganizations] = useState<
    Organization[]
  >([]);
  const [isDropdownLoaded, setIsDropdownLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const history = useHistory();
  const { hasAnyAuthority, selectedOrganization } = useAuth();
  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: isEdit ? 'default' : '',
      isSuper: user.isSuper,
      avatarUrl: user.avatarUrl,
      organizations: user.organizations,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const entity = useMemo(() => {
    return {
      name: 'Usu??rio',
      namePlural: 'Usu??rios',
      gender: 'M' as 'M' | 'F',
    };
  }, []);

  const { id: pathId } = useParams<UserPathParams>();

  const { addToast, addErrorToast } = useToast();

  const handleError = useCallback(
    (error: AxiosError, errorAction: string, handleAsPageError = false) => {
      const handledError = handleAxiosError(error, userErrors);
      const { messages, isPageError } = handledError;

      messages.forEach((message) => addErrorToast(errorAction, message));
      if (isPageError || handleAsPageError) {
        setErrorState(handledError);
      }
    },
    [addErrorToast],
  );

  useEffect(() => {
    if (hasAnyAuthority(['ROLE_SUPER_USER'])) {
      const organizationService: OrganizationService = new OrganizationService();
      organizationService
        .getOrganizations()
        .then((data) => {
          setDropdownOrganizations(data);
          setIsDropdownLoaded(true);
        })
        .catch((error) =>
          handleError(
            error,
            `carregar listagem de ${entity.namePlural.toLowerCase()}`,
            true,
          ),
        );
    } else {
      setIsDropdownLoaded(true);
    }
  }, [handleError, hasAnyAuthority, entity.namePlural]);

  useEffect(() => {
    const id = pathId;
    if (id) {
      setIsEdit(true);
      setUserId(id);
      const userService: UserService = new UserService();

      if (isDropdownLoaded) {
        userService
          .getUser(id)
          .then((response) => {
            response.avatarUrl = !response.avatarUrl ? '' : response.avatarUrl;
            return response;
          })
          .then((response) => {
            const { email, name, isSuper } = response;
            setUser({ email, name, password: 'default', isSuper });

            setValue('name', response.name, { shouldValidate: true });
            setValue('email', response.email, {
              shouldValidate: true,
            });
            setValue('password', response.password || 'default', {
              shouldValidate: true,
            });
            setValue('avatarUrl', response.avatarUrl, {
              shouldValidate: true,
            });
            setValue('isSuper', response.isSuper, { shouldValidate: true });
            setValue('organizations', response.organizations, {
              shouldValidate: true,
            });
          })
          .catch((error) => {
            handleError(
              error,
              `carregar ${entity.namePlural.toLowerCase()}`,
              true,
            );
          });
      }
    }
  }, [
    pathId,
    setValue,
    handleError,
    isDropdownLoaded,
    entity.namePlural,
    selectedOrganization,
  ]);

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
            title: `${entity.name} criad${
              entity.gender === 'M' ? 'o' : 'a'
            } com sucesso`,
            type: 'success',
          });
          history.goBack();
        })
        .catch((error: AxiosError) => {
          handleError(error, `criar ${entity.name}`);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [addToast, history, handleError, entity],
  );

  const handleEditSubmit = useCallback(
    (data) => {
      console.log(data);
      setIsSubmitting(true);
      const userService = new UserService();
      const userToSave = data;

      userToSave.id = userId;
      userToSave.password =
        userToSave.password === 'default' ? null : userToSave.password;
      userService
        .updateUser(userToSave)
        .then(() => {
          addToast({
            title: `${entity.name} alterad${
              entity.gender === 'M' ? 'o' : 'a'
            } com sucesso`,
            type: 'success',
          });
          history.goBack();
        })
        .catch((error: AxiosError) => {
          // console.error(error.response?.data.message);
          handleError(error, `alterar ${entity.name}`);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [addToast, history, handleError, userId, entity],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  const passwordHeader = <h6>Escolha uma senha</h6>;
  const passwordFooter = (
    <>
      <Divider />
      <p className="p-mt-2">Sugest??es</p>
      <ul className="p-pl-2 p-ml-2 p-mt-0" style={{ lineHeight: '1.5' }}>
        <li>Pelo menos uma letra min??scula</li>
        <li>Pelo menos uma letra mai??scula</li>
        <li>Pelo menos um n??mero</li>
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
      <div className="p-grid">
        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="nameInput">Nome *</label>
          <InputText
            {...register('name', {
              required: 'O nome do usu??rio ?? obrigat??rio',
            })}
            type="text"
            id="nameInput"
            value={user.name}
            className={errors.name ? 'p-invalid' : ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = onInputChange(e, 'name');
              setValue('name', val, { shouldValidate: true });
            }}
          />
          {errors?.name && (
            <small id="name-help" className="p-error">
              {errors.name.message}
            </small>
          )}
        </div>
        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="passwordInput">Senha *</label>
          <Controller
            name="password"
            control={control}
            render={(props) => (
              <Password
                {...register('password', {
                  required: 'A senha do usu??rio ?? obrigat??ria',
                  minLength: {
                    value: 6,
                    message: 'A senha precisa ter pelo menos 6 d??gitos',
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
                  setValue('password', e.target.value, {
                    shouldValidate: true,
                  });
                }}
                toggleMask={!props.field.value}
                weakLabel="Fraca"
                mediumLabel="Normal"
                strongLabel="Forte"
                promptLabel="Informe uma senha com pelo menos 6 d??gitos"
                header={passwordHeader}
                footer={passwordFooter}
                onShow={checkToCleanUserPassword}
              />
            )}
          />
          {errors?.password && (
            <small id="password-help" className="p-error">
              {errors.password.message}
            </small>
          )}
        </div>

        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="emailInput">E-mail *</label>
          <InputText
            {...register('email', {
              required: 'O e-mail do usu??rio ?? obrigat??rio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Endere??o de e-mail inv??lido. Ex. usuario@email.com',
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

        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="avatarUrlInput">URL do Avatar</label>
          <InputText
            {...register('avatarUrl')}
            type="text"
            id="avatarUrlInput"
            value={user.avatarUrl}
            className={errors.avatarUrl ? 'p-invalid' : ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = onInputChange(e, 'avatarUrl');
              setValue('avatarUrl', val, { shouldValidate: true });
            }}
          />
          {errors?.avatarUrl && (
            <small id="avatarUrl-help" className="p-error">
              {errors.avatarUrl.message}
            </small>
          )}
        </div>
      </div>

      {hasAnyAuthority(['ROLE_SUPER_USER']) && (
        <Fieldset legend="Administra????o (Super Usu??rio)">
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="organizations">Associar com organiza????es </label>
              <Controller
                name="organizations"
                control={control}
                render={(props) => (
                  <MultiSelect
                    {...register('organizations')}
                    id="organizations"
                    name="organizations"
                    value={props.field.value}
                    emptyFilterMessage="Nenhuma organiza????o encontrada"
                    selectedItemsLabel="{0} organiza????es selecionadas"
                    dataKey="id"
                    className={errors.organizations ? 'p-invalid' : ''}
                    onChange={(e) => {
                      props.field.onChange(e.target.value);
                    }}
                    options={dropdownOrganizations}
                    optionLabel="name"
                    display="chip"
                    placeholder="Nenhuma organiza????o associada"
                  />
                )}
              />
            </div>
            <div className="p-field-checkbox p-col-12 p-md-4">
              <InputSwitch
                {...register('isSuper')}
                inputId="isSuper"
                name="isSuper"
                className={errors.isSuper ? 'p-invalid' : ''}
                onChange={(e) => {
                  setUser({ ...user, isSuper: e.value });
                  setValue('isSuper', e.value, { shouldValidate: true });
                }}
                checked={user.isSuper}
              />
              <label htmlFor="isSuper">
                Conceder privil??gios de Super Usu??rio
              </label>
            </div>
          </div>
        </Fieldset>
      )}
    </CrudFormPageContainer>
  );
};

export default UserFormPage;
