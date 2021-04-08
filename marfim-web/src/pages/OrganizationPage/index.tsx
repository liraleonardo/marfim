import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import Organization from '../../model/Organization';
import OrganizationService from '../../services/OrganizationService';
import { Container } from './styles';

import defaultImg from '../../assets/default.jpg';
import { useAuth } from '../../hooks/auth';

const OrganizationPage: React.FC = () => {
  const { selectedOrganization } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganizations, setSelectedOrganizations] = useState<
    Organization[]
  >([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const dt: React.RefObject<DataTable> = useRef(null);

  const history = useHistory();
  const location = useLocation();

  const handleError = (error: AxiosError) => {
    console.error(error);
  };

  useEffect(() => {
    setIsLoading(true);
    setOrganizations([]);
    const organizationService = new OrganizationService();
    organizationService
      .getOrganizations()
      .then((data) => setOrganizations(data))
      .catch((error) => handleError(error))
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedOrganization]);

  const openNew = () => {
    history.push(location.pathname.concat('/form'));
  };

  const rightToolbarTemplate = () => {
    return (
      <>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success p-mr-2"
          onClick={openNew}
        />
      </>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Gerenciar Organizações</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            const search = e.target.value;
            setGlobalFilter(search);
            console.log('searching for ', search);
          }}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  const imageBodyTemplate = (rowData: Organization) => {
    return (
      <>
        <span className="p-column-title">Image</span>
        <img
          src={rowData.avatarUrl || defaultImg}
          alt={`${rowData.name}`}
          className="product-image"
        />
      </>
    );
  };

  const representativeBodyTemplate = (rowData: Organization) => {
    return (
      <>
        {/* <span className="p-column-title">Representative</span> */}
        <img
          alt={rowData.name}
          src={rowData.avatarUrl || defaultImg}
          width="32"
          style={{ verticalAlign: 'middle' }}
        />
        <span
          style={{ marginLeft: '.5em', verticalAlign: 'middle' }}
          className="image-text"
        >
          {rowData.name}
        </span>
      </>
    );
  };

  const editOrganization = (rowData: Organization) => {
    console.log('edit organization', rowData.name);
  };

  const confirmDeleteOrganization = (rowData: Organization) => {
    console.log('delete organization', rowData.name);
  };

  const actionBodyTemplate = (rowData: Organization) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editOrganization(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteOrganization(rowData)}
        />
      </div>
    );
  };

  // return <Container> Organizations Page </Container>;
  return (
    <div className="datatable crud-demo">
      <div className="card">
        <Toolbar className="p-mb-4" right={rightToolbarTemplate} />

        <DataTable
          ref={dt}
          value={organizations}
          selection={selectedOrganizations}
          onSelectionChange={(e) => setSelectedOrganizations(e.value)}
          emptyMessage="Nenhuma organização encontrada"
          loading={isLoading}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[10, 30, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} organizações"
          globalFilter={globalFilter}
          header={header}
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
          <Column
            field="name"
            header="Nome"
            body={representativeBodyTemplate}
            sortable
          />
          <Column field="description" header="Descrição" sortable />
          <Column field="cnpj" header="CNPJ" sortable />
          {/* <Column header="Ícone" body={imageBodyTemplate} /> */}
          <Column style={{ width: `${10}%` }} body={actionBodyTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default OrganizationPage;
