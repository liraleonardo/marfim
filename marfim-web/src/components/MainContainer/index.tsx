import React from 'react';
import { useAuth } from '../../hooks/auth';
import Main from '../Main';

const MainContainer: React.FC = ({ children }) => {
  const { isSigned, loadingAuthentication } = useAuth();

  if (loadingAuthentication)
    return <div style={{ color: '#000000' }}> Loading Authentication</div>;

  return <Main isToshowMain={isSigned}>{children}</Main>;
};

export default MainContainer;
