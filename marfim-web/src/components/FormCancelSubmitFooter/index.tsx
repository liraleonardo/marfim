import React from 'react';

import { Button } from 'primereact/button';
import { Container } from './styles';

interface FormCancelSubmitFooterProps {
  onCancelClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onSubmitClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

const FormCancelSubmitFooter: React.FC<FormCancelSubmitFooterProps> = ({
  onCancelClick,
  onSubmitClick,
}) => {
  return (
    <Container>
      <Button
        className="p-button-text"
        style={{ width: `${15}rem` }}
        icon="pi pi-fw pi-times"
        label="Cancelar"
        onClick={onCancelClick}
      />
      <Button
        icon="pi pi-fw pi-check"
        style={{ width: `${15}rem` }}
        label="Salvar"
        onClick={onSubmitClick}
      />
    </Container>
  );
};

export default FormCancelSubmitFooter;
