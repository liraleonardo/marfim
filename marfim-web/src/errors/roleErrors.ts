import { IAppError } from './AppErrorInterfaces';

export const roleErrors: IAppError[] = [
  {
    code: 'role not found',
    message: 'Perfil de Acesso não encontrado',
  },
  {
    code: 'requested role is not from current tenant organization',
    message: 'O perfil de acesso não pertence a esta organização',
  },
  {
    code: 'missing organization tenant id',
    message: 'Ocorreu um erro inesperado (Missing Tenant-ID)',
  },
  {
    code: 'there is another role with this name on organization',
    message: 'Existe outro perfil de acesso com o mesmo nome nesta organização',
  },
  {
    code: 'empty name',
    message: 'Falta o nome do perfil de acesso',
  },
  {
    code: 'should not delete role with users associated',
    message:
      'Não é possível remover um perfil de acesso que possui usuários associados. Remova antes as associações com usuários',
  },
];
