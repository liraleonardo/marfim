import { AxiosError } from 'axios';
import { IAppError, IErrorState } from './AppErrorInterfaces';
import {
  getEntityAxiosErrors,
  getGlobalAxiosErrors,
} from './globalAxiosErrors';
import { getHttpError, unexpectedError } from './httpErrors';

export const handleAxiosError = (
  err: AxiosError,
  entityErrors?: IAppError[],
): IErrorState => {
  let messages: string[] = [];
  let { title } = unexpectedError;
  let status = '#@$';
  let isPageError = false;

  if (err.response) {
    title = getHttpError(err.response.status).title;
    status = err.response.status.toString();

    switch (err.response.status) {
      case 401:
        isPageError = true;
        messages = [
          'Acesso não autorizado',
          ...getGlobalAxiosErrors(err.response.data.message),
        ];

        break;
      case 403:
        isPageError = true;
        messages = [
          'Usuário não tem acesso ao recurso solicitado',
          ...getGlobalAxiosErrors(err.response.data.message),
        ];
        break;

      // case 404: break;
      default: {
        if (entityErrors) {
          messages = [
            ...getEntityAxiosErrors(entityErrors, err.response.data.message),
          ];
        }
      }
    }
    if (messages.length === 0) {
      messages = [`Erro inesperado: ${err.response.data.message}`];
    }
  }
  if (messages.length === 0) {
    messages = [`Erro inesperado: ${err.message}`];
  }

  return { messages, title, status, isPageError };
};
