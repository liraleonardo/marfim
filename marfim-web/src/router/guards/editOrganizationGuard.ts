import { GuardFunction } from 'react-router-guards';
import {
  GuardFunctionRouteProps,
  GuardToRoute,
  Next,
} from 'react-router-guards/dist/types';

const editGuard: GuardFunction = (
  to: GuardToRoute,
  from: GuardFunctionRouteProps | null,
  next: Next,
): void => {
  // console.log(from, to);
  if (!from) {
    next.redirect('/');
    return;
  }

  if (to.location.pathname === from.location.pathname) {
    next.redirect('/');
    return;
  }

  next();
};

export default editGuard;
