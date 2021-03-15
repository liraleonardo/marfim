import React, { useEffect, useState } from 'react';

import { FiPower } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Container, Header, HeaderContent, Profile } from './styles';
import logoImg from '../../assets/logo.jpg';
import defaultImg from '../../assets/default.jpg';
import { useAuth, User } from '../../hooks/auth';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const { addToast } = useToast();

  const [apiData, setApiData] = useState('');

  useEffect(() => {
    api
      .get('user')
      .then((response) => {
        const users: any[] = response.data;
        setApiData(JSON.stringify(users));
      })
      .catch((err) => {
        // console.log(err.response.);
        addToast({
          type: 'error',
          title: 'Ocorreu um erro na requisição',
          description: `Erro ${err.response.status}: ${err.response.data.message} `,
        });
      });
  }, [addToast]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Marfim" />

          <Profile>
            <img src={user.avatarUrl || defaultImg} alt={user.name} />
            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <span>
        Resultado da Requisição: <br /> {apiData || '(sem resultados)'}
      </span>
    </Container>
  );
};

export default Dashboard;
