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
    code: 'only a super user or admin can set admin role privileges',
    message:
      'Apenas um Super Usuário ou Administrador pode conceder privilégios de Administrador',
  },
  {
    code: 'only a super user or admin can update an admin role',
    message:
      'Somente um Super Usuário ou Administrador pode alterar um perfil de Administrador',
  },
  {
    code: 'missing role organization',
    message:
      'Ocorreu um erro inesperado: Falta a Organização do Perfil de Acesso',
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
