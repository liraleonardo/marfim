import { IAppError } from './IAppError';

const organizationErrors: IAppError[] = [
  {
    code: 'requested organization id does not match the Tenant-ID',
    message: 'Ocorreu um erro inesperado (Tenant-ID not Match)',
  },
  {
    code: 'organization not found',
    message: 'Organização não encontrada',
  },
  {
    code: 'there is another organization with this name',
    message: 'Existe outra organização com o mesmo Nome',
  },
  {
    code: 'there is another organization with this cnpj',
    message: 'Existe outra organização com o mesmo CNPJ',
  },
  {
    code: 'data integrity violation',
    message: 'Não foi possível realizar a operação',
  },
  {
    code: 'cnpj must have 14 characters',
    message: 'CNPJ precisa ter 14 dígitos',
  },
  {
    code: 'empty name',
    message: 'Falta o Nome da Organização',
  },
  {
    code: 'empty cnpj',
    message: 'Falta o CNPJ da Organização',
  },
];

export const getOrganizationError = (code: string): string[] => {
  const errorsFound = organizationErrors
    .filter((error) => code.includes(error.code))
    .map((error) => error.message);

  // default error message
  if (errorsFound.length === 0) {
    return [`Erro inesperado: ${code}`];
  }

  return errorsFound;
};