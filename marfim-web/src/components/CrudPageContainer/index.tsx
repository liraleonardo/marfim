/* eslint-disable react/no-array-index-key */
import { confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnProps } from 'primereact/column';
import { Button, ButtonProps } from 'primereact/button';
import React, { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import { InputText } from 'primereact/inputtext';

import { useAuth } from '../../hooks/auth';
import Loading from '../Loading';
import ErrorContainer from '../ErrorContainer';
import { IErrorState } from '../../errors/AppErrorInterfaces';
import { Container } from './styles';

interface CrudPageContainerProps<T> {
  items: T[];
  isLoading: boolean;
  dataTableRef: React.RefObject<DataTable>;
  errorState?: IErrorState | undefined;
  entity: {
    name: string;
    namePlural: string;
    gender: 'M' | 'F';
  };
  columns: ColumnProps[];
  handleConfirmDeleteItem(entity: T): void;
  showCreateItemButtonForAuthorities?: string[];
  showItemActionColumn?: boolean;
  itemActionButtons?: ButtonProps[];

  showEditActionForAuthorities?: string[];
  showDeleteActionForAuthorities?: string[];
}

export interface HandleErrorProps {
  error: AxiosError;
  errorAction: string;
  handleAsPageError?: boolean;
}

const CrudPageContainer: React.FC<CrudPageContainerProps<unknown>> = ({
  items,
  isLoading,
  dataTableRef,
  errorState,
  entity,
  columns,
  showCreateItemButtonForAuthorities,
  showItemActionColumn = true,
  itemActionButtons = [],
  showEditActionForAuthorities,
  showDeleteActionForAuthorities,
  handleConfirmDeleteItem,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const history = useHistory();
  const location = useLocation();
  const { signOut, hasAnyAuthority } = useAuth();

  const showEditAction = useMemo(() => {
    if (!showEditActionForAuthorities) {
      return true;
    }
    return hasAnyAuthority(showEditActionForAuthorities);
  }, [hasAnyAuthority, showEditActionForAuthorities]);

  const showDeleteAction = useMemo(() => {
    if (!showDeleteActionForAuthorities) {
      return true;
    }
    return hasAnyAuthority(showDeleteActionForAuthorities);
  }, [hasAnyAuthority, showDeleteActionForAuthorities]);

  const showCreateItemButton = useMemo(() => {
    if (!showCreateItemButtonForAuthorities) {
      return true;
    }
    return hasAnyAuthority(showCreateItemButtonForAuthorities);
  }, [hasAnyAuthority, showCreateItemButtonForAuthorities]);

  const openFormPage = useCallback(() => {
    history.push(location.pathname.concat('/form'));
  }, [history, location.pathname]);

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Gerenciar {entity.namePlural}</h5>
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
        {showCreateItemButton && (
          <Button
            label={`Nov${entity.gender === 'M' ? 'o' : 'a'} ${entity.name}`}
            icon="pi pi-plus"
            className="p-button-success p-mr-2 p-ml-4"
            onClick={openFormPage}
          />
        )}
      </div>
    </div>
  );

  const openEditPage = (rowData: any) => {
    if (rowData.id) {
      history.push(location.pathname.concat('/edit/', rowData.id.toString()));
    }
  };

  const confirmDeleteOrganization = (rowData: any) => {
    confirmDialog({
      icon: 'pi pi-exclamation-triangle',
      message: `Você realmente deseja apagar ${
        entity.gender === 'M' ? 'o' : 'a'
      } ${entity.name.toLowerCase()} '${rowData.name}'?`,
      acceptLabel: 'Excluir',
      acceptClassName: 'p-button-warning',
      rejectLabel: 'Cancelar',
      rejectClassName: 'p-button-text p-button-warning',
      acceptIcon: 'pi pi-trash',
      accept: () => {
        if (rowData) {
          handleConfirmDeleteItem(rowData);
        }
      },
    });
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="actions">
        {/* TODO: fix ref error on Button component */}

        {/* {itemActionButtons.length > 0 &&
          itemActionButtons.map((actionButton, i) => (
            <Button
              key={`actionButton${i}`}
              {...actionButton}
              className={`${actionButton.className} p-button-rounded p-m-1`}
            />
          ))} */}

        {itemActionButtons.length === 0 && (
          <>
            {showEditAction && (
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-mr-2"
                onClick={() => openEditPage(rowData)}
                tooltip="Alterar"
              />
            )}
            {showDeleteAction && (
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-warning"
                onClick={() => confirmDeleteOrganization(rowData)}
                tooltip="Apagar"
              />
            )}
          </>
        )}
      </div>
    );
    return '';
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
    <Container className="datatable crud-demo">
      <Loading isLoading={isLoading} />
      {!isLoading && (
        <div className="card">
          <DataTable
            className="p-datatable-striped p-datatable-gridlines"
            ref={dataTableRef}
            value={items}
            emptyMessage={`Nenhum${
              entity.gender === 'M' ? '' : 'a'
            } ${entity.name.toLowerCase()} encontrad${
              entity.gender === 'M' ? 'o' : 'a'
            }`}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[10, 30, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate={`Exibindo {first} a {last} de {totalRecords} ${entity.namePlural.toLowerCase()}`}
            globalFilter={globalFilter}
            header={header}
          >
            {columns.map((column, i) => (
              <Column key={`column${i}`} {...column} />
            ))}
            {showItemActionColumn && (showEditAction || showDeleteAction) && (
              <Column style={{ width: `10%` }} body={actionBodyTemplate} />
            )}
          </DataTable>
        </div>
      )}
    </Container>
  );
};

export default CrudPageContainer;
