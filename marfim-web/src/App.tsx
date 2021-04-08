import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
// import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Router from './router';

import AppProvider from './hooks';

import GlobalStyle from './styles/global';
import './styles/theme-light.css';
import './styles/AppDemo.scss';
import MainContainer from './components/MainContainer';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        {(content: React.ReactNode, routeProps: RouteComponentProps) => (
          <MainContainer {...routeProps}>{content}</MainContainer>
        )}
      </Router>
      <GlobalStyle />
    </AppProvider>
  );
};

export default App;
