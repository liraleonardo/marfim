import { DataTable } from 'primereact/datatable';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Organization from '../../model/Organization';
import OrganizationService from '../../services/OrganizationService';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { organizationErrors } from '../../errors/organizationErrors';
import { maskedCnpj } from '../../utils/maskUtils';
import { IErrorState } from '../../errors/AppErrorInterfaces';
import { handleAxiosError } from '../../errors/axiosErrorHandler';
import { AvatarNameContainer } from '../../components/AvatarNameContainer';
import CrudPageContainer, {
  HandleErrorProps,
} from '../../components/CrudPageContainer';

const OrganizationPage: React.FC = () => {
  const { selectedOrganization } = useAuth();
  const { addToast } = useToast();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<IErrorState | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const dt: React.RefObject<DataTable> = useRef(null);

  const { addErrorToast } = useToast();

  const handleError = useCallback(
    ({
      error: err,
      errorAction,
      handleAsPageError = false,
    }: HandleErrorProps) => {
      const handledError = handleAxiosError(err, organizationErrors);
      const { messages, isPageError } = handledError;
      messages.forEach((message) => addErrorToast(errorAction, message));
      if (isPageError || handleAsPageError) {
        setError(handledError);
      }
    },
    [addErrorToast],
  );

  const reloadOrganizations = useCallback(() => {
    setIsLoading(true);
    setOrganizations([]);
    const organizationService = new OrganizationService();
    organizationService
      .getOrganizations()
      .then((data) => {
        if (data) setOrganizations(data);
      })
      .catch((err) => {
        handleError({ error: err, errorAction: 'carregar organizações' });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [handleError]);

  useEffect(() => {
    setError(undefined);
    reloadOrganizations();
  }, [selectedOrganization, reloadOrganizations]);

  const avatarNameBodyTemplate = (rowData: Organization) => {
    return (
      <AvatarNameContainer
        name={rowData.name}
        avatarUrl={rowData.avatarUrl}
        defaultAvatarIcon="pi pi-briefcase"
      />
    );
  };

  const organizationCnpjBodyTemplate = (rowData: Organization) => {
    return (
      <>
        <span className="image-text">{maskedCnpj(rowData.cnpj)}</span>
      </>
    );
  };

  const handleConfirmDeleteOrganization = useCallback(
    (rowData: Organization): void => {
      if (rowData.id) {
        const organizationService = new OrganizationService();
        organizationService
          .deleteOrganization(rowData.id)
          .then(() => {
            addToast({
              title: 'Organização deletada com Sucesso',
              type: 'success',
            });
            reloadOrganizations();
          })
          .catch((err) =>
            handleError({
              error: err,
              errorAction: 'deletar organização',
            }),
          );
      }
    },
    [addToast, reloadOrganizations, handleError],
  );

  return (
    <CrudPageContainer
      items={organizations}
      columns={[
        {
          field: 'name',
          header: 'Nome',
          body: avatarNameBodyTemplate,
          sortable: true,
        },
        { field: 'description', header: 'Descrição', sortable: true },
        {
          field: 'cnpj',
          header: 'CNPJ',
          body: organizationCnpjBodyTemplate,
          sortable: true,
        },
      ]}
      dataTableRef={dt}
      isLoading={isLoading}
      errorState={error}
      entity={{ name: 'Organização', namePlural: 'Organizações', gender: 'F' }}
      handleConfirmDeleteItem={handleConfirmDeleteOrganization}
      showCreateItemButton
      showItemActionColumn
    />
  );
};

export default OrganizationPage;
