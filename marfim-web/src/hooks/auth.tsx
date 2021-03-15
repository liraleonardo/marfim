import React, { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api';

export interface User {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signInGoogle(token: string): Promise<boolean>;
  setSignedIn(user: User, token: string): void;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Marfim:token');
    const user = localStorage.getItem('@Marfim:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('login/marfim', {
      email,
      password,
    });

    const { token, userDetails } = response.data;
    const { user } = userDetails;

    localStorage.setItem('@Marfim:token', token);
    localStorage.setItem('@Marfim:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Marfim:token');
    localStorage.removeItem('@Marfim:user');

    api.defaults.headers = {};

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@Marfim:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  const setSignedIn = useCallback(
    (user: User, token: string) => {
      console.log(user, token);
      localStorage.setItem('@Marfim:user', JSON.stringify(user));
      localStorage.setItem('@Marfim:token', token);

      api.defaults.headers = {
        Authorization: `Bearer ${token}`,
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      };

      setData({ token, user });
    },
    [setData],
  );

  const signInGoogle = useCallback(
    async (requestToken: string) => {
      console.log(requestToken);

      const response = await api.post('login/google', { token: requestToken });

      // console.log('response', response);

      const { userDetails, token } = response.data;
      const { user } = userDetails;
      // console.log('user', user);

      setSignedIn(user, token);

      // localStorage.setItem('@Marfim:user', JSON.stringify(user));
      // localStorage.setItem('@Marfim:token', token);

      // api.defaults.headers = {
      //   Authorization: `Bearer ${token}`,
      // };

      // setData({ token, user });

      return false;
    },
    [setSignedIn],
  );

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn,
        signInGoogle,
        setSignedIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
