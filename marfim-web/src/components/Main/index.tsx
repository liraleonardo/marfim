import React, { useCallback, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/components/menuitem/MenuItem';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Container, AppTopBar, AppMain, AppSideBar, PageTitle } from './styles';

import logoImg from '../../assets/logo.jpg';
import { useAuth } from '../../hooks/auth';
import { getRoutesMap } from '../../utils/routeUtils';

interface OrganizationMenuItem extends MenuItem {
  organizationId: number;
}

interface MainProps {
  isToshowMain: boolean;
}

const Main: React.FC<MainProps> = ({ children, isToshowMain }) => {
  const [menuMode, setMenuMode] = useState('static');
  const [showMenu, setShowMenu] = useState(true);
  const location = useLocation();

  const menuRef = useRef<Menu>(null);
  const history = useHistory();

  const routeMap = useMemo(() => getRoutesMap(), []);

  const {
    user,
    signOut,
    chooseOrganization,
    selectedOrganization,
    organizations,
  } = useAuth();

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
          label: 'Editar Perfil',
          icon: 'pi pi-fw pi-user-edit',
          command: () => {
            history.push('/profile');
          },
        },
        {
          label: 'Sair',
          icon: 'pi pi-fw pi-power-off',
          command: () => {
            signOut();
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

  const sideBarMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-chart-line',
      command: () => {
        history.push('/');
      },
    },
    {
      label: 'Organizações',
      icon: 'pi pi-fw pi-briefcase',
      command: () => {
        history.push('/organizations');
      },
    },
    {
      label: 'Usuários',
      icon: 'pi pi-fw pi-users',
      command: () => {
        history.push('/users');
      },
    },
    {
      label: 'Controle de Acesso',
      icon: 'pi pi-fw pi-unlock',
      command: () => {
        history.push('/roles');
      },
    },
    {
      label: 'Projetos',
      icon: 'pi pi-fw pi-list',
      command: () => {
        history.push('/projects');
      },
    },
  ];

  const containerClassName = classNames('layout-wrapper', {
    'layout-static': menuMode === 'static',
    'layout-static-inactive': menuMode === 'static-inactive',
  });

  if (isToshowMain) {
    return (
      <Container className={containerClassName} data-theme="light">
        {showMenu && (
          <AppSideBar className="layout-sidebar">
            <Link to="/">
              <img src={logoImg} alt="Marfim" />
            </Link>
            <div className="layout-menu-container">
              <Menu
                className="layout-menu"
                model={sideBarMenuItems}
                style={{ height: '100%', width: 250, border: 0 }}
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
                <span>{routeMap[location.pathname]}</span>
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
