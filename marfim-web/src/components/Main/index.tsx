import React, { useCallback, useRef, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { MenuItem } from 'primereact/components/menuitem/MenuItem';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, AppTopBar, AppMain, AppSideBar, PageTitle } from './styles';

import logoImg from '../../assets/logo.jpg';
import { useAuth } from '../../hooks/auth';

interface OrganizationMenuItem extends MenuItem {
  organizationId: number;
}

interface MainProps {
  isToshowMain: boolean;
}

const Main: React.FC<MainProps> = ({ children, isToshowMain }) => {
  const [showMenu, setShowMenu] = useState(true);
  const location = useLocation();

  const menuRef = useRef<Menu>(null);
  const history = useHistory();

  const toggleMenu = useCallback(() => {
    setShowMenu(!showMenu);
  }, [showMenu]);

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

  const topBarStart = (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <Button
        style={{ border: 0, backgroundColor: 'transparent', borderWidth: 0 }}
        alt="hide-sidebar"
        icon="pi pi-fw pi-bars"
        height="40"
        className="p-mr-2"
        onClick={toggleMenu}
      />
      <PageTitle> {location.pathname} </PageTitle>
    </div>
  );

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

  if (isToshowMain) {
    return (
      <Container>
        {showMenu && (
          <AppSideBar className="app-side-bar">
            <img src={logoImg} alt="Marfim" />

            <Menu
              className="app-pages-menu"
              model={sideBarMenuItems}
              style={{ height: '100%', width: 250, border: 0 }}
              ref={menuRef}
              id="app-menu"
            />
          </AppSideBar>
        )}
        <AppMain>
          <AppTopBar className="app-top-bar">
            <Toolbar
              left={topBarStart}
              right={topBarEnd}
              style={{ height: 60, border: 0 }}
            />
          </AppTopBar>
          <div>{children}</div>
        </AppMain>
      </Container>
    );
  }
  return <>{children}</>;
};

export default Main;
