import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';

import { Organization, useAuth } from '../../hooks/auth';

interface ChooseOraganizationContainerProps {
  organizations: Organization[];
  toOpen: boolean;
  onRequestClose(): void;
}

const ChooseOraganizationContainer: React.FC<ChooseOraganizationContainerProps> = ({
  organizations,
  toOpen,
  onRequestClose,
}) => {
  const { chooseOrganization } = useAuth();
  return (
    <Dialog
      visible={toOpen}
      header="Você tem acesso a mais de uma organização"
      onHide={onRequestClose}
      className="p-fluid"
      closeOnEscape
      focusOnShow={false}
    >
      <Dropdown
        options={organizations}
        onChange={(e) => chooseOrganization(e.value)}
        optionLabel="name"
        placeholder="Selecione uma organização"
      />
    </Dialog>
  );
};
export default ChooseOraganizationContainer;
