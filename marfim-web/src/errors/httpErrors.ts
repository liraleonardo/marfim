import { IHttpErrors, IHttpError } from './AppErrorInterfaces';

const httpErrors: IHttpErrors = {
  '401': {
    title: 'ERRO DE AUTENTICAÇÃO',
    redirect: {
      action: 'Refazer login',
      to: '/',
    },
  },
  '403': {
    title: 'ACESSO NEGADO',
    redirect: {
      to: '/',
    },
  },
  '404': {
    title: 'RECURSO NÃO ENCONTRADO',
    redirect: {
      to: '/',
    },
  },
};

export const unexpectedError: IHttpError = {
  title: 'ERRO INESPERADO',
  redirect: {
    to: '/',
    action: 'Voltar para a página inicial',
  },
};

export const getHttpErrors = (): IHttpErrors => {
  return httpErrors;
};

export const getHttpError = (error: string | number): IHttpError => {
  const errorStr = error.toString();
  const errorFound = httpErrors[errorStr];
  return errorFound || unexpectedError;
};
