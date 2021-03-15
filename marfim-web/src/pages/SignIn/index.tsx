import React, { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useAuth, User } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import { Container, Content, AnimationContainer, Background } from './styles';
import Button from '../../components/Button';
import Input from '../../components/Input';

import logoImg from '../../assets/logo.jpg';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignInFormData {
  email: string;
  password: string;
}

interface GoogleResponse {
  profileObject: {
    name: string;
    email: string;
  };
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn, user, signInGoogle } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  // console.log(user);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
        });
      }
    },
    [signIn, addToast, history],
  );

  const googleLoginSuccess = useCallback(
    (response) => {
      const { tokenId: token } = response;
      if (token) {
        signInGoogle(token)
          .then(() => {
            addToast({
              type: 'info',
              title: 'Google login success',
            });
          })
          .catch((err) => {
            addToast({
              type: 'error',
              title: 'Error while trying to login with Google.',
            });
          });
      }
    },
    [addToast, signInGoogle],
  );

  const googleLoginFail = useCallback(() => {
    addToast({
      type: 'info',
      title: 'Google login failed',
    });
  }, [addToast]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Marfim" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon </h1>

            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Entrar</Button>

            <Link to="forgot-password">Esqueci minha senha</Link>
          </Form>

          <GoogleLogin
            clientId="398635961278-1b9mf9kmvbcqv91b2cuivdrt08rd06mb.apps.googleusercontent.com"
            buttonText="Login com o Google"
            onSuccess={googleLoginSuccess}
            onFailure={googleLoginFail}
          />

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
