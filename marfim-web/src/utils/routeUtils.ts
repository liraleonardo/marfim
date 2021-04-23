import { MenuItem } from 'primereact/components/menuitem/MenuItem';
import getRoutes, { RouteProps } from '../router/routes';
import {
  WITH_AUTH,
  SHOW_ROUTE_LABEL,
  SHOW_MENU,
  MENU_ICON,
  PUBLIC_MENU,
  MENU_PERMISSIONS,
} from '../router/types';

export function getPublicRoutes(): string[] {
  return getRoutes()
    .filter((route) => !route.meta || !route.meta[WITH_AUTH])
    .map((route) => route.path);
}

interface RoutesLabelsMap {
  [key: string]: string;
}

export function getRoutesMap(): RoutesLabelsMap {
  const result: RoutesLabelsMap = {};

  getRoutes().forEach((route) => {
    result[route.path] =
      route.meta && route.meta[SHOW_ROUTE_LABEL]
        ? route.meta[SHOW_ROUTE_LABEL]
        : '';
  });

  return result;
}

export function userHasAuthority(
  authorities: string[],
  route: RouteProps,
): boolean {
  if (!route.meta) return false;

  if (route.meta[PUBLIC_MENU]) return true;

  const menuPermissions: string[] = route.meta[MENU_PERMISSIONS];

  const authorizedMenuItems = authorities.filter((authority: string) => {
    return (
      ['ROLE_SUPER_USER', 'ROLE_ADMIN_USER'].includes(authority) ||
      menuPermissions.includes(authority)
    );
  });

  return authorizedMenuItems && authorizedMenuItems.length > 0;
}

export function getMenuItemsWithAuthorities(
  authorities: string[],
  callback: (path: string) => void,
): MenuItem[] {
  const menuItems = getRoutes()
    .filter(
      (route) =>
        route.meta &&
        route.meta[SHOW_MENU] &&
        userHasAuthority(authorities, route),
    )
    .map((route) => {
      if (!route.meta) return {} as MenuItem;

      const menuItem: MenuItem = {
        icon: route.meta[MENU_ICON],
        label: `${route.meta[SHOW_ROUTE_LABEL]}`,
        command: () => callback(route.path),
      };

      return menuItem;
    });

  return menuItems;
}

export function getMenuItems(callback: (path: string) => void): MenuItem[] {
  return getMenuItemsWithAuthorities([], callback);
}
