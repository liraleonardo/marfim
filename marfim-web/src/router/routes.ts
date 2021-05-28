import { PageComponent } from 'react-router-guards';
import { GuardFunction, Meta } from 'react-router-guards/dist/types';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import OrganizationPage from '../pages/Organization/OrganizationPage';
import OrganizationFormPage from '../pages/Organization/OrganizationFormPage';
import ProfilePage from '../pages/ProfilePage';
import ProjectPage from '../pages/ProjectPage';
import RolePage from '../pages/Role/RolePage';
import RoleUserPage from '../pages/Role/RoleUserPage';
import RolePermissionPage from '../pages/Role/RolePermissionPage';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import UserPage from '../pages/User/UserPage';
import {
  WITH_AUTH,
  SHOW_ROUTE_LABEL,
  SHOW_MENU,
  MENU_ICON,
  PUBLIC_MENU,
  MENU_PERMISSIONS,
} from './types';
import editGuard from './guards/editOrganizationGuard';
import UserFormPage from '../pages/User/UserFormPage';
import RoleFormPage from '../pages/Role/RoleFormPage';

export interface RouteProps {
  key: string;
  path: string;
  component: React.FC<unknown>;
  exact?: boolean;
  loading?: PageComponent;
  error?: PageComponent;
  meta?: Meta;
  ignoreGlobal?: boolean;
  guards?: GuardFunction[];
}

const defaultEditGuard: GuardFunction[] = [editGuard];

export default (): RouteProps[] => [
  {
    key: 'signInPage',
    path: '/signin',
    exact: true,
    component: SignInPage,
  },
  {
    key: 'signUpPage',
    path: '/signup',
    exact: true,
    component: SignUpPage,
  },
  {
    key: 'dashboardPage',
    path: '/',
    exact: true,
    component: DashboardPage,
    loading: 'Custom loading for home page...',
    error: 'Custom error for home page',
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Dashboard',
      [SHOW_MENU]: true,
      [MENU_ICON]: 'pi pi-fw pi-chart-line',
      [PUBLIC_MENU]: true,
    },
  },
  {
    key: 'profilePage',
    path: '/profile',
    exact: true,
    component: ProfilePage,
    loading: 'Custom loading for home page...',
    error: 'Custom error for home page',
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Meu Perfil',
      [SHOW_MENU]: false,
      [MENU_ICON]: 'pi pi-fw pi-user',
      [MENU_PERMISSIONS]: ['PROFILE_READ', 'PROFILE_ALL'],
    },
  },
  {
    key: 'organizationsPage',
    path: '/organizations',
    exact: true,
    component: OrganizationPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Organizações',
      [SHOW_MENU]: true,
      [MENU_ICON]: 'pi pi-fw pi-briefcase',
      [MENU_PERMISSIONS]: ['ORGANIZATIONS_READ', 'ORGANIZATIONS_ALL'],
    },
  },
  {
    key: 'organizationsFormPage',
    path: '/organizations/form',
    exact: true,
    component: OrganizationFormPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Nova Organização',
    },
  },
  {
    key: 'organizationsEditPage',
    path: '/organizations/edit/:id',
    exact: false,
    component: OrganizationFormPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Alterar Organização',
    },
    guards: defaultEditGuard,
  },
  {
    key: 'usersPage',
    path: '/users',
    exact: true,
    component: UserPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Usuários',
      [SHOW_MENU]: true,
      [MENU_ICON]: 'pi pi-fw pi-users',
      [MENU_PERMISSIONS]: ['USERS_READ', 'USERS_ALL'],
    },
  },
  {
    key: 'usersFormPage',
    path: '/users/form',
    exact: true,
    component: UserFormPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Novo Usuário',
    },
  },
  {
    key: 'usersEditPage',
    path: '/users/edit/:id',
    exact: false,
    component: UserFormPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Alterar Usuário',
    },
    guards: defaultEditGuard,
  },
  {
    key: 'rolesPage',
    path: '/roles',
    exact: true,
    component: RolePage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Controle de Acesso',
      [SHOW_MENU]: true,
      [MENU_ICON]: 'pi pi-fw pi-unlock',
      [MENU_PERMISSIONS]: ['ROLES_READ', 'ROLES_ALL'],
    },
  },
  {
    key: 'rolesFormPage',
    path: '/roles/form',
    exact: true,
    component: RoleFormPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Novo Perfil de Acesso',
    },
  },
  {
    key: 'rolesEditPage',
    path: '/roles/edit/:id',
    exact: false,
    component: RoleFormPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Alterar Perfil de Acesso',
    },
    guards: defaultEditGuard,
  },
  {
    key: 'roleUsersPage',
    path: '/roles/:id/users',
    exact: false,
    component: RoleUserPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Alterar Usuários do Perfil',
    },
    guards: defaultEditGuard,
  },
  {
    key: 'rolePermissionsPage',
    path: '/roles/:id/permissions',
    exact: false,
    component: RolePermissionPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Alterar Permissões do Perfil',
    },
    guards: defaultEditGuard,
  },
  {
    key: 'projectsPage',
    path: '/projects',
    exact: true,
    component: ProjectPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Projetos',
      [SHOW_MENU]: true,
      [MENU_ICON]: 'pi pi-fw pi-list',
      [MENU_PERMISSIONS]: ['PROJECTS_READ', 'PROJECTS_ALL'],
    },
  },
  {
    key: 'notFoundPage',
    path: '*',
    component: NotFoundPage,
    ignoreGlobal: true,
  },
];
