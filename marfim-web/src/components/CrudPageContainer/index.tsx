/* eslint-disable react/no-array-index-key */
import { confirmDialog } from 'primereact/confirmdialog';
import {
  DataTable,
  ExpandedRows,
  RowEventParams,
  RowToggleParams,
} from 'primereact/datatable';
import { Column, ColumnProps } from 'primereact/column';
import { Button } from 'primereact/button';
import React, {
  ReactFragment,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import { InputText } from 'primereact/inputtext';

import { useAuth } from '../../hooks/auth';
import Loading from '../Loading';
import ErrorContainer from '../ErrorContainer';
import { IErrorState } from '../../errors/AppErrorInterfaces';
import { Container } from './styles';

interface CrudPageContainerProps {
  items: any[];
  isLoading: boolean;
  dataTableRef: React.RefObject<DataTable>;
  errorState?: IErrorState | undefined;
  entity: {
    name: string;
    namePlural: string;
    gender: 'M' | 'F';
  };
  columns: ColumnProps[];
  handleConfirmDeleteItem(entity: any): void;
  showCreateItemButtonForAuthorities?: string[];
  showItemActionColumn?: boolean;
  itemActionExtraBody?(data: any): ReactNode;

  showEditActionForAuthorities?: string[];
  showDeleteActionForAuthorities?: string[];
  customButtonsContent?: ReactFragment;
  showCustomButtonsOnHeaderForAuthorities?: string[];
  expandedRows?: any[] | ExpandedRows;
  onRowToggle?(e: RowToggleParams): void;
  onRowExpand?(e: RowEventParams): void;
  onRowCollapse?(e: RowEventParams): void;
  rowExpansionTemplate?(data: any): ReactNode;
}

export interface HandleErrorProps {
  error: AxiosError;
  errorAction: string;
  handleAsPageError?: boolean;
}

const CrudPageContainer: React.FC<CrudPageContainerProps> = ({
  items,
  isLoading,
  dataTableRef,
  errorState,
  entity,
  columns,
  showCreateItemButtonForAuthorities,
  showItemActionColumn = true,
  itemActionExtraBody,
  showEditActionForAuthorities,
  showDeleteActionForAuthorities,
  customButtonsContent,
  showCustomButtonsOnHeaderForAuthorities,
  handleConfirmDeleteItem,
  expandedRows,
  onRowToggle,
  onRowExpand,
  onRowCollapse,
  rowExpansionTemplate,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const history = useHistory();
  const location = useLocation();
  const { signOut, hasAnyAuthority } = useAuth();

  const checkToShowForAuthorities = useCallback(
    (authorities): boolean => {
      if (!authorities) {
        return true;
      }
      return hasAnyAuthority(authorities);
    },
    [hasAnyAuthority],
  );

  const showEditAction = useMemo(() => {
    return checkToShowForAuthorities(showEditActionForAuthorities);
  }, [checkToShowForAuthorities, showEditActionForAuthorities]);

  const showDeleteAction = useMemo(() => {
    return checkToShowForAuthorities(showDeleteActionForAuthorities);
  }, [checkToShowForAuthorities, showDeleteActionForAuthorities]);

  const showCreateItemButton = useMemo(() => {
    return checkToShowForAuthorities(showCreateItemButtonForAuthorities);
  }, [checkToShowForAuthorities, showCreateItemButtonForAuthorities]);

  const showCustomButtonsOnHeader = useMemo(() => {
    return checkToShowForAuthorities(showCustomButtonsOnHeaderForAuthorities);
  }, [checkToShowForAuthorities, showCustomButtonsOnHeaderForAuthorities]);

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
        {showCustomButtonsOnHeader && customButtonsContent}
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
        {!!itemActionExtraBody && itemActionExtraBody(rowData)}

        {showEditAction && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-success p-ml-2"
            onClick={() => openEditPage(rowData)}
            tooltip="Alterar"
          />
        )}
        {showDeleteAction && (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-warning p-ml-2"
            onClick={() => confirmDeleteOrganization(rowData)}
            tooltip="Apagar"
          />
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
            expandedRows={expandedRows}
            onRowToggle={onRowToggle}
            onRowExpand={onRowExpand}
            onRowCollapse={onRowCollapse}
            rowExpansionTemplate={rowExpansionTemplate}
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
