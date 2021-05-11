import { IAppError } from './AppErrorInterfaces';

const globalAxiosErrors: IAppError[] = [
  {
    code: 'Error while decoding the token. JWT expired',
    message: 'Sua sessão expirou',
  },
];

const globalErrors: IAppError[] = [
  {
    code: 'Network Error',
    message: 'Sem conexão com o servidor',
  },
];

export const getEntityAxiosErrors = (
  entityErrors: IAppError[],
  code: string,
): string[] => {
  const errorsFound = entityErrors
    .filter((error) => code.includes(error.code))
    .map((error) => error.message);
  return errorsFound && errorsFound.length > 0 ? errorsFound : [];
};

export const getGlobalAxiosErrors = (code: string): string[] => {
  return getEntityAxiosErrors(globalAxiosErrors, code);
};

export const getGlobalErrors = (code: string): string[] => {
  return getEntityAxiosErrors(globalErrors, code);
};
