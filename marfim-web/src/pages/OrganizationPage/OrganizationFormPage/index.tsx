/* eslint-disable jsx-a11y/label-has-associated-control */
import { AxiosError } from 'axios';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import {
  useHistory,
  useLocation,
  matchPath,
  useParams,
} from 'react-router-dom';
import FormCancelSubmitFooter from '../../../components/FormCancelSubmitFooter';
import { useToast } from '../../../hooks/toast';
import Organization, {
  ICreateUpdateOrganization,
} from '../../../model/Organization';
import OrganizationService from '../../../services/OrganizationService';

interface OrganizationPathParams {
  id?: string;
}

const OrganizationFormPage: React.FC = () => {
  const emptyOrganization: ICreateUpdateOrganization = new Organization();
  const [isEdit, setIsEdit] = useState(false);
  const [organization, setOrganization] = useState(emptyOrganization);

  const history = useHistory();
  const location = useLocation();
  const { id: pathId } = useParams<OrganizationPathParams>();

  const { addToast } = useToast();

  useEffect(() => {
    const id = Number(pathId);
    if (matchPath(location.pathname, { path: '/organizations/edit/:id' })) {
      // if (!id) {
      //   history.goBack();
      //   return;
      // }
      setIsEdit(true);
      const organizationService: OrganizationService = new OrganizationService();

      if (id) {
        organizationService.getOrganization(id).then((response) => {
          setOrganization(response);
        });
      }
    }
  }, [location.pathname, pathId, history]);

  const onInputChange = (e: { target: { value: string } }, name: string) => {
    const val = (e.target && e.target.value) || '';
    const updatedOrganization: any = { ...organization };
    updatedOrganization[`${name}`] = val;

    // console.log(`organization.${name}=${val}`);
    setOrganization(updatedOrganization);
  };

  const handleSubmit = useCallback(() => {
    const organizationService = new OrganizationService();
    // console.log('submit', organization);
    const organizationToSave = organization;
    organizationToSave.cnpj = organizationToSave.cnpj
      .replaceAll('.', '')
      .replaceAll('/', '')
      .replaceAll('-', '');
    // console.log('toSave', organizationToSave);

    if (isEdit) {
      organizationService
        .updateOrganization(organization)
        .then((response) => {
          addToast({
            title: 'Organização alterada com sucesso',
            type: 'success',
          });
          history.goBack();
        })
        .catch((error: AxiosError) => {
          console.error(error.response?.data.message);
          addToast({
            title: 'Ocorreu um erro ao alterar a Organização',
            type: 'error',
            description: error.response?.data.message,
          });
        });
    } else {
      organizationService
        .createOrganization(organization)
        .then(() => {
          addToast({
            title: 'Organização criada com sucesso',
            type: 'success',
          });
          history.goBack();
        })
        .catch((error: AxiosError) => {
          console.error(error.response?.data.message);
          addToast({
            title: 'Ocorreu um erro ao criar a Organização',
            type: 'error',
            description: error.response?.data.message,
          });
        });
    }
  }, [organization, addToast, history, isEdit]);

  const handleCancel = useCallback(() => {
    // console.log('cancel');
    history.goBack();
  }, [history]);

  // console.log(organization);
  return (
    <div className="p-col-12">
      <div className="card">
        <div className="p-fluid">
          <h5>
            <span>{isEdit ? 'Editar ' : 'Cadastrar '}Organização</span>
          </h5>
          <div className="p-grid ">
            <div className="p-field p-col-12 p-md-8">
              <label htmlFor="nameInput">Nome da Organização</label>
              <InputText
                type="text"
                id="nameInput"
                required
                autoFocus
                value={organization.name || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  onInputChange(e, 'name');
                }}
              />
            </div>
            <div className="p-field p-col-12 p-md-4">
              <label htmlFor="cnpjInput">CNPJ</label>
              <InputMask
                mask="99.999.999/9999-99"
                type="text"
                id="cnpjInput"
                required
                value={organization.cnpj || ''}
                onChange={(e) => {
                  onInputChange(e, 'cnpj');
                }}
              />
            </div>

            <div className="p-field p-col-12 p-md-12">
              <label htmlFor="avatarUrlInput">URL do Avatar</label>
              <InputText
                type="text"
                id="avatarUrlInput"
                autoFocus
                value={organization.avatarUrl || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  onInputChange(e, 'avatarUrl');
                }}
              />
            </div>

            <div className="p-field p-col-12 p-md-12">
              <label htmlFor="descriptionInput">Descrição da Organização</label>
              <InputTextarea
                type="text"
                id="descriptionInput"
                autoFocus
                value={organization.description || ''}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  onInputChange(e, 'description');
                }}
              />
            </div>
          </div>
        </div>
        <FormCancelSubmitFooter
          onSubmitClick={handleSubmit}
          onCancelClick={handleCancel}
        />
      </div>
    </div>
  );
};

export default OrganizationFormPage;
