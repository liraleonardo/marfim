/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, useCallback, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';

import { useAuth } from '../../hooks/auth';
import Loading from '../Loading';
import ErrorContainer from '../ErrorContainer';
import { IErrorState } from '../../errors/AppErrorInterfaces';
import FormCancelSubmitFooter from '../FormCancelSubmitFooter';

interface CrudFormPageContainerProps<T> {
  isEdit: boolean;
  isDirty: boolean;
  isValid: boolean;
  isLoading: boolean;
  isSubmiting: boolean;
  errorState?: IErrorState | undefined;
  entity: {
    name: string;
    namePlural: string;
    gender: 'M' | 'F';
  };
  onSubmitEdit(): void;
  onSubmitCreate(): void;
  onCancel(): void;
}

export interface HandleErrorProps {
  error: AxiosError;
  errorAction: string;
  handleAsPageError?: boolean;
}

const CrudFormPageContainer: React.FC<CrudFormPageContainerProps<unknown>> = ({
  isEdit,
  isDirty,
  isValid,
  isLoading,
  isSubmiting,
  errorState,
  entity,
  onSubmitEdit,
  onSubmitCreate,
  onCancel,
  children,
}) => {
  const history = useHistory();
  const { signOut } = useAuth();

  const handleErrorButtonCLick = useCallback(() => {
    if (errorState && errorState.status.toString() === '401') {
      signOut();
    }
    history.push('/');
  }, [history, signOut, errorState]);

  if (isLoading) {
    return <Loading isLoading={isLoading} />;
  }

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
            <span>
              {isEdit ? `Alterar ${entity.name}` : `Cadastrar ${entity.name}`}
            </span>
          </h5>
          {children}
        </div>

        {isEdit && (
          <FormCancelSubmitFooter
            submitDisabled={!isDirty || !isValid || isSubmiting}
            onSubmitClick={onSubmitEdit}
            onCancelClick={onCancel}
          />
        )}
        {!isEdit && (
          <FormCancelSubmitFooter
            submitDisabled={!isValid || isSubmiting}
            onSubmitClick={onSubmitCreate}
            onCancelClick={onCancel}
          />
        )}
      </div>
    </div>
  );
};

export default CrudFormPageContainer;
