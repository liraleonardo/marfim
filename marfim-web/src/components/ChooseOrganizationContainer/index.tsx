import React from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';

import { Container } from './styles';
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
    <Container toShow={toOpen}>
      <div>
        <div>
          <h1>Selecione uma Organização </h1>
          <button type="button" onClick={onRequestClose}>
            <FaRegTimesCircle size={20} />
          </button>
        </div>
        {organizations.map((organization) => (
          <button
            key={organization.id}
            type="button"
            onClick={() => {
              chooseOrganization(organization);
            }}
          >
            {organization.name}
          </button>
        ))}
      </div>
    </Container>
  );
};
export default ChooseOraganizationContainer;
