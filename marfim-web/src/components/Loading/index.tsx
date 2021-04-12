import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

import { Container } from './styles';

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) {
    return <></>;
  }

  return (
    <Container>
      <ProgressSpinner />
      <span> Aguarde, estamos carregando as informações ... </span>
    </Container>
  );
};

export default Loading;
