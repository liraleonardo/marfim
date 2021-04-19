import { confirmDialog } from 'primereact/confirmdialog';
import briefcase from 'primeicons/raw-svg/briefcase.svg';
import warning from 'primeicons/raw-svg/exclamation-triangle.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import { InputText } from 'primereact/inputtext';
import Organization from '../../model/Organization';
import OrganizationService from '../../services/OrganizationService';

import { useAuth } from '../../hooks/auth';
import Loading from '../../components/Loading';
import { useToast } from '../../hooks/toast';
import { organizationErrors } from '../../errors/organizationErrors';
import { maskedCnpj } from '../../utils/maskUtils';
import ErrorContainer from '../../components/ErrorContainer';
import { IErrorState } from '../../errors/AppErrorInterfaces';
import { handleAxiosError } from '../../errors/axiosErrorHandler';

const OrganizationPage: React.FC = () => {
  const { selectedOrganization, signOut } = useAuth();
  const { addToast, addErrorToast } = useToast();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [errorState, setErrorState] = useState<IErrorState>();
  const [selectedOrganizations, setSelectedOrganizations] = useState<
    Organization[]
  >([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const dt: React.RefObject<DataTable> = useRef(null);

  const history = useHistory();
  const location = useLocation();

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

  const reloadOrganizations = useCallback(() => {
    setIsLoading(true);
    setOrganizations([]);
    const organizationService = new OrganizationService();
    organizationService
      .getOrganizations()
      .then((data) => {
        if (data) setOrganizations(data);
      })
      .catch((error) => {
        handleError(error, 'carregar organizações');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [handleError]);

  useEffect(() => {
    setErrorState(undefined);
    reloadOrganizations();
  }, [selectedOrganization, reloadOrganizations]);

  const openFormPage = () => {
    history.push(location.pathname.concat('/form'));
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Gerenciar Organizações</h5>
      <div>
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

        <Button
          label="Nova Organização"
          icon="pi pi-plus"
          className="p-button-success p-mr-2 p-ml-4"
          onClick={openFormPage}
        />
      </div>
    </div>
  );

  const organizationNameBodyTemplate = (rowData: Organization) => {
    return (
      <>
        {rowData.avatarUrl && (
          <img
            alt={rowData.name}
            src={rowData.avatarUrl}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = warning;
              e.currentTarget.style.backgroundColor = '#FBC02D';
              e.currentTarget.style.padding = '5px';
            }}
            width="34"
            style={{
              verticalAlign: 'middle',
              backgroundColor: '#fff',
              borderRadius: '50%',
              padding: 3,
              boxShadow:
                '2px 2px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.19)',
            }}
          />
        )}
        {!rowData.avatarUrl && (
          <img
            alt={rowData.name}
            src={briefcase}
            width="34"
            style={{
              verticalAlign: 'middle',
              backgroundColor: '#fff',
              borderRadius: '50%',
              padding: 3,
              boxShadow:
                '2px 2px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.19)',
            }}
          />
        )}

        <span
          style={{ marginLeft: '1em', verticalAlign: 'middle' }}
          className="image-text"
        >
          {rowData.name}
        </span>
      </>
    );
  };

  const organizationCnpjBodyTemplate = (rowData: Organization) => {
    return (
      <>
        <span className="image-text">{maskedCnpj(rowData.cnpj)}</span>
      </>
    );
  };

  const openEditPage = (rowData: Organization) => {
    if (rowData.id) {
      history.push(location.pathname.concat('/edit/', rowData.id.toString()));
    }
  };

  const handleConfirmDeleteOrganization = (id: number): void => {
    const organizationService = new OrganizationService();
    organizationService
      .deleteOrganization(id)
      .then(() => {
        addToast({
          title: 'Organização Deletada com Sucesso',
          type: 'success',
        });
        reloadOrganizations();
      })
      .catch((error) => handleError(error, 'deletar organização'));
  };

  const confirmDeleteOrganization = (rowData: Organization) => {
    confirmDialog({
      icon: 'pi pi-exclamation-triangle',
      message: `Você realmente deseja deletar a organização '${rowData.name}'?`,
      acceptLabel: 'Excluir',
      acceptClassName: 'p-button-warning',
      rejectLabel: 'Cancelar',
      rejectClassName: 'p-button-text p-button-warning',
      acceptIcon: 'pi pi-trash',
      accept: () => {
        if (rowData.id) {
          handleConfirmDeleteOrganization(rowData.id);
        }
      },
    });
  };

  const actionBodyTemplate = (rowData: Organization) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => openEditPage(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteOrganization(rowData)}
        />
      </div>
    );
  };
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
    <div className="datatable crud-demo">
      <Loading isLoading={isLoading} />
      {!isLoading && (
        <div className="card">
          <DataTable
            className="p-datatable-striped p-datatable-gridlines"
            ref={dt}
            value={organizations}
            selection={selectedOrganizations}
            onSelectionChange={(e) => setSelectedOrganizations(e.value)}
            emptyMessage="Nenhuma organização encontrada"
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[10, 30, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} organizações"
            globalFilter={globalFilter}
            header={header}
          >
            {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} /> */}
            <Column
              field="name"
              header="Nome"
              body={organizationNameBodyTemplate}
              sortable
            />
            <Column field="description" header="Descrição" sortable />
            <Column
              field="cnpj"
              header="CNPJ"
              body={organizationCnpjBodyTemplate}
              sortable
            />
            <Column style={{ width: `${10}%` }} body={actionBodyTemplate} />
          </DataTable>
        </div>
      )}
    </div>
  );
};

export default OrganizationPage;
