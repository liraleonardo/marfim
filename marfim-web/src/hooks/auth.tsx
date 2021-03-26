import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../services/api';
import {
  getAuthStateFromStorage,
  removeAuthStateFromStorage,
  setAuthStateToStorage,
} from '../utils/storageService';

export interface Organization {
  id: string;
  name: string;
}

export interface User {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  isSuper: boolean;
}

export interface AuthState {
  token: string;
  user: User;
  organizations?: Organization[];
  selectedOrganization?: Organization;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signInGoogle(token: string): Promise<boolean>;
  setSignedIn(authState: AuthState): void;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  // const [toChooseOrganization, setToChooseOrganization] = useState(false);

  const setSignedIn = useCallback(
    (authState: AuthState) => {
      if (authState.token) {
        api.defaults.headers.Authorization = `Bearer ${authState.token}`;
      }

      if (authState.selectedOrganization) {
        api.defaults.headers[
          'X-TenantID'
        ] = `${authState.selectedOrganization.id}`;
      }

      setData(authState);
    },
    [setData],
  );

  useEffect(() => {
    setSignedIn(getAuthStateFromStorage());
  }, [setSignedIn]);

  const signOut = useCallback(() => {
    removeAuthStateFromStorage();

    api.defaults.headers = {};

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@Marfim:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
        organizations: data.organizations,
      });
    },
    [setData, data],
  );

  const handleSignIn = useCallback(
    (authState: AuthState) => {
      const { user } = authState;
      const handledAuthState: AuthState = authState;

      if (user.isSuper) {
        handledAuthState.organizations = undefined;
        handledAuthState.selectedOrganization = undefined;
      }

      if (handledAuthState.organizations) {
        if (handledAuthState.organizations.length === 0) {
          throw new Error('There is no organization associated with this user');
        }

        if (handledAuthState.organizations.length === 1) {
          [
            handledAuthState.selectedOrganization,
          ] = handledAuthState.organizations;
        } else {
          // TODO: call a modal for choosing a organization
          throw new Error(
            'There is more than one organization associated with this user',
          );
        }
      }

      setAuthStateToStorage(authState);
      setSignedIn(handledAuthState);
    },
    [setSignedIn],
  );

  const signIn = useCallback(
    async ({ email, password }) => {
      const response = await api.post('login/marfim', {
        email,
        password,
      });

      const authState: AuthState = response.data;

      handleSignIn(authState);
    },
    [handleSignIn],
  );

  const signInGoogle = useCallback(
    async (requestToken: string) => {
      const response = await api.post('login/google', { token: requestToken });

      const authState: AuthState = response.data;

      handleSignIn(authState);

      return false;
    },
    [handleSignIn],
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
      {/* <ChooseOrganizationContainer
        organizations={data.organizations}
        show={toChooseOrganization}
      /> */}
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
