import { PageComponent } from 'react-router-guards';
import { Meta } from 'react-router-guards/dist/types';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import Organization from '../pages/Organization';
import Profile from '../pages/Profile';
import Project from '../pages/Project';
import Role from '../pages/Role';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import User from '../pages/User';
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
    component: SignIn,
  },
  {
    key: 'signUpPage',
    path: '/signup',
    exact: true,
    component: SignUp,
  },
  {
    key: 'dashboardPage',
    path: '/',
    exact: true,
    component: Dashboard,
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
    component: Profile,
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
    component: Organization,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Organizações',
    },
  },
  {
    key: 'usersPage',
    path: '/users',
    exact: true,
    component: User,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Usuários',
    },
  },
  {
    key: 'rolesPage',
    path: '/roles',
    exact: true,
    component: Role,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Controle de Acesso',
    },
  },
  {
    key: 'projectsPage',
    path: '/projects',
    exact: true,
    component: Project,
    meta: {
      [WITH_AUTH]: true,
      [SHOW_ROUTE_LABEL]: 'Projetos',
    },
  },
  {
    key: 'notFoundPage',
    path: '*',
    component: NotFound,
    ignoreGlobal: true,
  },
];
