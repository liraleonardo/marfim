import React, { ReactNode, useMemo } from 'react';

import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import NotFoundPage from '../pages/NotFoundPage';
import { requireAuthenticated, waitOneSecond } from './guards';

import getRoutes from './routes';

const GLOBAL_GUARDS = [requireAuthenticated];

interface ReactNodeInterface {
  children: ReactNode | any;
}

const Router: React.FC<ReactNodeInterface> = ({ children }) => {
  const routes = useMemo(() => getRoutes(), []);

  return (
    <BrowserRouter>
      <GuardProvider
        guards={GLOBAL_GUARDS}
        loading="Loading..."
        error={NotFoundPage}
      >
        {children && (
          <Route
            render={(routeProps) =>
              children(
                <Switch>
                  {routes.map(
                    ({
                      key,
                      component,
                      error,
                      exact,
                      ignoreGlobal,
                      loading,
                      meta,
                      path,
                    }) => (
                      <GuardedRoute
                        key={key}
                        component={component}
                        exact={exact}
                        error={error}
                        ignoreGlobal={ignoreGlobal}
                        loading={loading}
                        meta={meta}
                        path={path}
                      />
                    ),
                  )}
                </Switch>,
                routeProps,
                // eslint-disable-next-line prettier/prettier
              )}
          />
        )}
      </GuardProvider>
    </BrowserRouter>
  );
};

export default Router;
