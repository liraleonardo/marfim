import { IAppError } from './AppErrorInterfaces';

export const organizationErrors: IAppError[] = [
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
  {
    code: 'only a SUPER_USER can create or delete a organization',
    message: 'Apenas um super usuário pode criar ou apagar organizações',
  },
];
