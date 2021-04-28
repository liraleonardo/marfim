import React from 'react';
import { useLocation } from 'react-router-dom';
import ErrorContainer from '../../components/ErrorContainer';

const NotFoundPage: React.FC = () => {
  const location = useLocation();

  return (
    <ErrorContainer
      status="404"
      messages={[
        `A página '${location.pathname}' não existe, foi movida, ou está temporariamente indisponível`,
      ]}
      title="PÁGINA NÃO ENCONTRADA"
    />
  );
};

export default NotFoundPage;
