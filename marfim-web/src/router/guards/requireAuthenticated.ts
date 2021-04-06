import { GuardFunction } from 'react-router-guards';
import {
  GuardFunctionRouteProps,
  GuardToRoute,
  Next,
} from 'react-router-guards/dist/types';
import { getAuthStateFromStorage } from '../../utils/storageService';
import { WITH_AUTH } from '../types';
import getRoutes from '../routes';
import { getPublicRoutes } from '../../utils/routeUtils';

const requireAuthenticated: GuardFunction = (
  to: GuardToRoute,
  from: GuardFunctionRouteProps | null,
  next: Next,
): void => {
  // check if user is authenticated --> can we change for useAuth???
  const { user, token } = getAuthStateFromStorage();
  const getIsLoggedIn = !!user && !!token;

  // find all routes that does not use authentication
  const withoutAuthRoutes = getPublicRoutes();

  // redirect to signin when route needs authentication and user is not authenticated
  if (to.meta[WITH_AUTH] && !getIsLoggedIn) {
    next.redirect('/signin');
  }
  // redirect to home or last location when route does not needs authentication and user is authenticated
  if (!to.meta[WITH_AUTH] && getIsLoggedIn) {
    const pathToRedirect =
      from && !withoutAuthRoutes.includes(from.location.pathname)
        ? from.location.pathname
        : '/';
    next.redirect({
      pathname: pathToRedirect,
    });
  }
  next();
};

export default requireAuthenticated;
