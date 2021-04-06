import getRoutes, { RouteProps } from '../router/routes';
import { WITH_AUTH, SHOW_ROUTE_LABEL } from '../router/types';

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
