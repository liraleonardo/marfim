import { IAppError } from './AppErrorInterfaces';

const globalAxiosErrors: IAppError[] = [
  {
    code: 'Error while decoding the token. JWT expired',
    message: 'Sua sessão expirou',
  },
];

export const getEntityAxiosErrors = (
  entityErrors: IAppError[],
  code: string,
): string[] => {
  const errorsFound = entityErrors
    .filter((error) => code.includes(error.code))
    .map((error) => error.message);
  return errorsFound;
};

export const getGlobalAxiosErrors = (code: string): string[] => {
  return getEntityAxiosErrors(globalAxiosErrors, code);
};
