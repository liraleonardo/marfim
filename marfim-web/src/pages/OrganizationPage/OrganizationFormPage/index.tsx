/* eslint-disable jsx-a11y/label-has-associated-control */
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import FormCancelSubmitFooter from '../../../components/FormCancelSubmitFooter';
import { useToast } from '../../../hooks/toast';
import Organization, {
  ICreateUpdateOrganization,
} from '../../../model/Organization';
import OrganizationService from '../../../services/OrganizationService';
import { organizationErrors } from '../../../errors/organizationErrors';
import { maskedCnpj, unmaskCnpj } from '../../../utils/maskUtils';
import { handleAxiosError } from '../../../errors/axiosErrorHandler';
import { IErrorState } from '../../../errors/AppErrorInterfaces';
import ErrorContainer from '../../../components/ErrorContainer';
import { useAuth } from '../../../hooks/auth';

interface OrganizationPathParams {
  id?: string;
}

const OrganizationFormPage: React.FC = () => {
  const emptyOrganization: ICreateUpdateOrganization = new Organization();
  const [isEdit, setIsEdit] = useState(false);
  const [errorState, setErrorState] = useState<IErrorState>();
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [organization, setOrganization] = useState(emptyOrganization);
  const [organizationId, setOrganizationId] = useState<number | null>(null);

  const history = useHistory();
  const { signOut } = useAuth();
  const location = useLocation();
  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      name: organization.name,
      cnpj: organization.cnpj,
      avatarUrl: organization.avatarUrl,
      description: organization.description,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { id: pathId } = useParams<OrganizationPathParams>();

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
    console.log('checking edition?');
    const id = Number(pathId);
    if (
      id
      // && matchPath(location.pathname, { path: '/organizations/edit/:id' })
    ) {
      setIsEdit(true);
      setOrganizationId(id);
      const organizationService: OrganizationService = new OrganizationService();

      organizationService
        .getOrganization(id)
        .then((response) => {
          response.cnpj = maskedCnpj(response.cnpj);
          response.avatarUrl = !response.avatarUrl ? '' : response.avatarUrl;
          response.description = !response.description
            ? ''
            : response.description;
          return response;
        })
        .then((response) => {
          setOrganization(response);

          setValue('name', response.name, { shouldValidate: true });
          setValue('cnpj', response.cnpj, {
            shouldValidate: true,
          });
          setValue('avatarUrl', response.avatarUrl);
          setValue('description', response.description);
        })
        .catch((error) => {
          // console.log('error while looking for organizations');
          handleError(error, 'carregar organizações', true);
        });
    }
  }, [location.pathname, pathId, history, setValue, handleError]);

  // const handleError = useCallback(
  //   (error: AxiosError, errorAction: string) => {
  //     let messages;
  //     if (error.response) {
  //       messages = getOrganizationError(error.response.data.message);
  //     } else {
  //       messages = getOrganizationError(error.message);
  //     }
  //     messages.forEach((message) => addErrorToast(errorAction, message));
  //   },
  //   [addErrorToast],
  // );

  const onInputChange = useCallback(
    (e: { target: { value: string } }, name: string): any => {
      const val = (e.target && e.target.value) || '';
      const updatedOrganization: any = { ...getValues() };
      updatedOrganization[`${name}`] = val;

      // console.log(`onChange(): organization.${name}=${val}`);
      setOrganization(updatedOrganization);

      return val;
    },
    [getValues],
  );

  const handleCreateSubmit = useCallback(
    (data) => {
      setIsSubmitting(true);
      const organizationService = new OrganizationService();
      const organizationToSave = data;
      organizationToSave.cnpj = unmaskCnpj(organizationToSave.cnpj);

      organizationService
        .createOrganization(organizationToSave)
        .then(() => {
          addToast({
            title: 'Organização criada com sucesso',
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
      const organizationService = new OrganizationService();
      const organizationToSave = data;
      organizationToSave.cnpj = unmaskCnpj(organizationToSave.cnpj);

      organizationToSave.id = organizationId;
      organizationService
        .updateOrganization(organizationToSave)
        .then(() => {
          addToast({
            title: 'Organização alterada com sucesso',
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
    [addToast, history, handleError, organizationId],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleErrorButtonCLick = useCallback(() => {
    if (errorState && errorState.status.toString() === '401') {
      signOut();
    }
    history.push('/');
  }, [history, signOut, errorState]);

  if (errorState) {
    return (
      <ErrorContainer
        status={errorState.status}
        title={errorState.title}
        messages={errorState.messages}
        buttonLabel={errorState.status === 401 ? 'Refazer login' : undefined}
        onButtonClick={handleErrorButtonCLick}
      />
    );
  }

  return (
    <div className="p-col-12">
      <div className="card">
        <div className="p-fluid">
          <h5>
            <span>{isEdit ? 'Editar ' : 'Cadastrar '}Organização</span>
          </h5>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-8">
              <label htmlFor="nameInput">Nome da Organização *</label>
              <InputText
                {...register('name', {
                  required: 'O nome da organização é obrigatório',
                })}
                type="text"
                id="nameInput"
                value={organization.name}
                className={errors.name ? 'p-invalid' : ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const val = onInputChange(e, 'name');
                  setValue('name', val, { shouldValidate: true });
                }}
                tooltip="Informe um nome único para a organização"
              />
              {errors?.name && (
                <small id="name-help" className="p-error">
                  {errors.name.message}
                </small>
              )}
            </div>
            <div className="p-field p-col-12 p-md-4">
              <label htmlFor="cnpjInput">CNPJ *</label>
              <InputMask
                {...register('cnpj', {
                  required: 'O CNPJ da organização é obrigatório',
                  pattern: {
                    value: /[0-9]{2}[.][0-9]{3}[.][0-9]{3}[/][0-9]{4}[-][0-9]{2}/i,
                    message: 'Informe todos os 14 dígitos do cnpj',
                  },
                })}
                mask="99.999.999/9999-99"
                type="text"
                id="cnpjInput"
                value={organization.cnpj}
                tooltip="Informe um CNPJ válido para a organização"
                className={errors.cnpj ? 'p-invalid' : ''}
                onChange={(e) => {
                  const val = onInputChange(e, 'cnpj');
                  setValue('cnpj', val, { shouldValidate: true });
                }}
              />
              {errors?.cnpj && (
                <small id="cnpj-help" className="p-error">
                  {errors.cnpj.message}
                </small>
              )}
            </div>

            <div className="p-field p-col-12 p-md-12">
              <label htmlFor="avatarUrlInput">URL do Avatar</label>
              <InputText
                {...register('avatarUrl')}
                type="text"
                id="avatarUrlInput"
                value={organization.avatarUrl}
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

            <div className="p-field p-col-12 p-md-12">
              <label htmlFor="descriptionInput">Descrição da Organização</label>
              <InputTextarea
                {...register('description')}
                type="text"
                id="descriptionInput"
                value={organization.description}
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
        </div>

        {isEdit && (
          <FormCancelSubmitFooter
            submitDisabled={!isDirty || !isValid || isSubmiting}
            onSubmitClick={handleFormSubmit(handleEditSubmit)}
            onCancelClick={handleCancel}
          />
        )}
        {!isEdit && (
          <FormCancelSubmitFooter
            submitDisabled={!isValid || isSubmiting}
            onSubmitClick={handleFormSubmit(handleCreateSubmit)}
            onCancelClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default OrganizationFormPage;
