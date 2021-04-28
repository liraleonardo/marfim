import React from 'react';
import { useAuth } from '../../hooks/auth';
import Main from '../Main';

const MainContainer: React.FC = ({ children }) => {
  const { authenticated } = useAuth();
  return <Main isToshowMain={authenticated}>{children}</Main>;
};

export default MainContainer;
