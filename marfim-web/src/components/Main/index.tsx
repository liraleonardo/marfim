import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Menubar } from 'primereact/menubar';
import { PanelMenu } from 'primereact/panelmenu';
import {
  MenuItem,
  MenuItemOptions,
} from 'primereact/components/menuitem/MenuItem';
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

import { SHOW_ROUTE_LABEL } from '../../router/types';
import MenuService from '../../services/MenuService';
import { parseToMenuItem } from '../../model/IMenuItem';
import { AvatarNameContainer } from '../AvatarNameContainer';

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

  const [sideBarMenuItems, setSideBarMenuItems] = useState<MenuItem[]>([]);

  const location = useLocation();

  const menuRef = useRef<PanelMenu>(null);

  const {
    user,
    signOut,
    chooseOrganization,
    selectedOrganization,
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

  const loadSideBarMenuItem = useCallback(() => {
    const menuService = new MenuService();
    menuService
      .getMenuItems()
      .then((menus) => {
        const menuItems = menus.map((menu) => {
          return parseToMenuItem(menu, history.push);
        });
        setSideBarMenuItems(menuItems);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [history.push]);

  useEffect(() => {
    if (authenticated) {
      loadSideBarMenuItem();
    }
  }, [authenticated, loadSideBarMenuItem, selectedOrganization]);

  const handleSignOut = useCallback(() => {
    signOut();
    history.push('/'); // forcing location to be on '/', so the next login will redirect to '/'
  }, [signOut, history]);

  const menuUserOrganizationTemplate = (
    userOrg: { id: any; name?: string; avatarUrl?: string },
    isUser: boolean,
    item: MenuItem,
    options: MenuItemOptions,
  ) => {
    if (userOrg) {
      return (
        /* eslint-disable */
        <a
          className={options.className}
          target={item.target}
          onClick={options.onClick}
          role="menuitem"
          href="#"
          key={userOrg.id}
        >
          <AvatarNameContainer
            name={userOrg.name || '<Nome do Usuário>'}
            avatarUrl={userOrg.avatarUrl}
            defaultAvatarIcon={isUser ? 'pi pi-users' : 'pi pi-briefcase'}
          />
          {item.items!! && (<span className="p-submenu-icon pi pi-angle-down" />)}
        </a>
        /* eslint-enable */
      );
    }
    return undefined;
  };
  // TODO: refactor to useCallback
  const topBarMenuItems: MenuItem[] = [
    {
      label: selectedOrganization.name,
      icon: 'pi pi-fw pi-briefcase',
      template: (item, options) => {
        return menuUserOrganizationTemplate(
          selectedOrganization,
          false,
          item,
          options,
        );
      },
      items: organizations
        .filter((organization) => organization.id !== selectedOrganization.id)
        .map((organization) => {
          return {
            organizationId: organization.id,
            label: organization.name,
            icon: 'pi pi-fw pi-briefcase',
            template: (item, options) => {
              return menuUserOrganizationTemplate(
                organization,
                false,
                item,
                options,
              );
            },
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
      template: (item, options) => {
        return menuUserOrganizationTemplate(user, true, item, options);
      },
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

  const topBarEnd = (
    <Menubar className="layout-topbar-menu" model={topBarMenuItems} />
  );

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
              <PanelMenu
                className="layout-menu"
                model={sideBarMenuItems}
                ref={menuRef}
                id="app-menu"
                multiple={false}
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
