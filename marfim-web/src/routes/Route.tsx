import React from 'react';
import {
  Route as ReactRoute,
  RouteProps as ReactRouteProps,
  Redirect,
} from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import Main from '../pages/Main';

interface RouteProps extends ReactRouteProps {
  isPublic?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPublic = false,
  component: Component,
  ...rest
}) => {
  const { isSigned } = useAuth();
  const isPrivate = !isPublic;
  return (
    <ReactRoute
      {...rest}
      render={({ location }) => {
        if (isPrivate && isSigned) {
          return (
            <Main>
              <Component />
            </Main>
          );
        }
        if (isPrivate !== isSigned) {
          return (
            <Redirect
              to={{
                pathname: isPrivate ? '/signin' : '/',
                state: { from: location },
              }}
            />
          );
        }
        return <Component />;
      }}
    />
  );
};

export default Route;
