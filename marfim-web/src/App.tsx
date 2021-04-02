import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Routes from './routes';

import AppProvider from './hooks';

import GlobalStyle from './styles/global';
import './styles/theme.css';

const App: React.FC = () => (
  <Router>
    <AppProvider>
      <Routes />
    </AppProvider>

    <GlobalStyle />
  </Router>
);

export default App;
