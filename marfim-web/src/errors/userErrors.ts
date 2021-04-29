import { IAppError } from './AppErrorInterfaces';

export const userErrors: IAppError[] = [
  {
    code: 'missing tenant-ID',
    message: 'Ocorreu um erro inesperado: Falta Tenant-ID',
  },
  {
    code: 'user not found',
    message: 'Usuário não encontrado',
  },
  {
    code: 'there is another user with this email',
    message: 'Existe outro usuário com o mesmo E-mail',
  },
  {
    code: 'only a super user can grant super user privileges',
    message:
      'Apenas um Super Usuário pode conceder privilégios de Super Usuário',
  },
  {
    code: 'a super user can only be updated by another super user',
    message: 'Somente um Super Usuário pode alterar um Super Usuário',
  },
  {
    code: 'requested user is not from current tenant organization',
    message: 'O usuário não pertence a sua organização',
  },
  {
    code: 'empty email',
    message: 'Falta o e-mail do Usuário',
  },
  {
    code: 'invalid email format',
    message: 'Formato de e-mail inválido',
  },
  {
    code: 'empty password',
    message: 'Falta a senha do Usuário',
  },
  {
    code: 'password has less than 6 characters',
    message: 'A senha precisa ter pelo menos 6 caracteres',
  },
  {
    code: 'empty name',
    message: 'Falta o nome do Usuário',
  },
  {
    code: 'user already linked with current organization',
    message: 'O usuário já está associado com esta organização',
  },
];
