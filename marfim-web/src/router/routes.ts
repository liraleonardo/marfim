import { PageComponent } from 'react-router-guards';
import { Meta } from 'react-router-guards/dist/types';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import OrganizationPage from '../pages/OrganizationPage';
import ProfilePage from '../pages/ProfilePage';
import ProjectPage from '../pages/ProjectPage';
import RolePage from '../pages/RolePage';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import UserPage from '../pages/UserPage';
import { WITH_AUTH, SHOW_ROUTE_LABEL } from './types';

export interface RouteProps {
  key: string;
  path: string;
  component: React.FC<unknown>;
  exact?: boolean;
  loading?: PageComponent;
  error?: PageComponent;
  meta?: Meta;
  ignoreGlobal?: boolean;
}

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
    },
  },
  {
    key: 'usersPage',
    path: '/users',
    exact: true,
    component: UserPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Usuários',
    },
  },
  {
    key: 'rolesPage',
    path: '/roles',
    exact: true,
    component: RolePage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Controle de Acesso',
    },
  },
  {
    key: 'projectsPage',
    path: '/projects',
    exact: true,
    component: ProjectPage,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Projetos',
    },
  },
  {
    key: 'notFoundPage',
    path: '*',
    component: NotFoundPage,
    ignoreGlobal: true,
  },
];
