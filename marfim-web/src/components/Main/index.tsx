import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/components/menuitem/MenuItem';
import { Link, matchPath, useHistory, useLocation } from 'react-router-dom';
import {
  Container,
  AppTopBar,
  AppMain,
  AppSideBar,
  SidebarSeparator,
} from './styles';

import logoImg from '../../assets/logo-horizontal.svg';
import { useAuth } from '../../hooks/auth';
import getRoutes from '../../router/routes';
import {
  getMenuItems,
  getMenuItemsWithAuthorities,
} from '../../utils/routeUtils';

import { SHOW_ROUTE_LABEL, SHOW_MENU, MENU_ICON } from '../../router/types';
import GenericService from '../../services/GenericService';

interface OrganizationMenuItem extends MenuItem {
  organizationId: number;
}

interface MainProps {
  isToshowMain: boolean;
}

const Main: React.FC<MainProps> = ({ children, isToshowMain }) => {
  const [menuMode, setMenuMode] = useState('static');
  const [showMenu, setShowMenu] = useState(true);
  const [routeLabel, setRouteLabel] = useState('');

  const routes = useMemo(() => getRoutes(), []);
  const history = useHistory();

  const defaultSideBar = useMemo(() => getMenuItems(history.push), []);
  const [sideBarMenuItems, setSideBarMenuItems] = useState<MenuItem[]>(
    defaultSideBar,
  );

  const location = useLocation();

  const menuRef = useRef<Menu>(null);

  const {
    user,
    signOut,
    chooseOrganization,
    selectedOrganization,
    authorities,
    organizations,
    authenticated,
  } = useAuth();

  useEffect(() => {
    const routeFound = routes.find((route) => {
      return !!matchPath(location.pathname, {
        path: route.path,
        exact: true,
      });
    });

    if (routeFound && routeFound.meta)
      setRouteLabel(routeFound.meta[SHOW_ROUTE_LABEL]);
    else setRouteLabel('');
  }, [routes, location.pathname]);

  useEffect(() => {
    if (authenticated) {
      setSideBarMenuItems(
        getMenuItemsWithAuthorities(authorities, history.push),
      );
    }
  }, [authorities, history.push, authenticated]);

  const handleSignOut = useCallback(() => {
    signOut();
    history.push('/'); // forcing location to be on '/', so the next login will redirect to '/'
  }, [signOut, history]);

  // TODO: refactor to useCallback
  const topBarMenuItems: MenuItem[] = [
    {
      label: selectedOrganization.name,
      icon: 'pi pi-fw pi-briefcase',
      items: organizations
        .filter((organization) => organization.id !== selectedOrganization.id)
        .map((organization) => {
          return {
            organizationId: organization.id,
            label: organization.name,
            icon: 'pi pi-fw pi-briefcase',
            command: (e) => {
              const { organizationId } = e.item as OrganizationMenuItem;
              const organizationChoosed = organizations.find(
                (org) => org.id === organizationId,
              );
              if (organizationChoosed) chooseOrganization(organizationChoosed);
            },
          } as OrganizationMenuItem;
        }),
    },

    {
      label: user?.name || 'User Name Placeholder',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Alterar Perfil',
          icon: 'pi pi-fw pi-user-edit',
          command: () => {
            history.push('/profile');
          },
        },
        {
          label: 'Sair',
          icon: 'pi pi-fw pi-power-off',
          command: () => {
            handleSignOut();
          },
        },
      ],
    },
  ];

  const toggleMenu = useCallback(() => {
    setShowMenu(!showMenu);
    if (menuMode === 'static') setMenuMode('static-inactive');
    if (menuMode === 'static-inactive') setMenuMode('static');
  }, [showMenu, menuMode]);

  const topBarEnd = <Menubar style={{ border: 0 }} model={topBarMenuItems} />;

  const containerClassName = classNames('layout-wrapper', {
    'layout-static': menuMode === 'static',
    'layout-static-inactive': menuMode === 'static-inactive',
  });

  if (isToshowMain) {
    return (
      <Container className={containerClassName} data-theme="light">
        {showMenu && (
          <AppSideBar className="layout-sidebar">
            <Link to="/" className="logo">
              <img src={logoImg} alt="Marfim" />
            </Link>
            <SidebarSeparator />
            <div className="layout-menu-container">
              <Menu
                className="layout-menu"
                model={sideBarMenuItems}
                style={{ border: 0 }}
                ref={menuRef}
                id="app-menu"
              />
            </div>
          </AppSideBar>
        )}
        <AppMain className="layout-content-wrapper">
          <AppTopBar className="layout-topbar">
            <div className="topbar-left">
              <button
                type="button"
                className="menu-button p-link"
                onClick={toggleMenu}
              >
                <i className="pi pi-chevron-left" />
              </button>
              <span className="topbar-separator" />

              <div
                className="layout-breadcrumb viewname"
                style={{ textTransform: 'uppercase' }}
              >
                <span>{routeLabel}</span>
              </div>
            </div>

            <div className="topbar-right">{topBarEnd}</div>
          </AppTopBar>
          <div className="layout-content">{children}</div>
        </AppMain>
      </Container>
    );
  }
  return <>{children}</>;
};

export default Main;
