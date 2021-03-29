import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import ChooseOraganizationContainer from '../components/ChooseOrganizationContainer';
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
  isSigned: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signInGoogle(token: string): Promise<boolean>;
  chooseOrganization(organization: Organization): void;
  setHeaders(authState: AuthState): void;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [isSigned, setIsSigned] = useState(false);
  const [toChooseOrganization, setToChooseOrganization] = useState(false);

  const setHeaders = useCallback(
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
    const authState = getAuthStateFromStorage();
    if (authState.user && authState.token) {
      setHeaders(authState);
      setIsSigned(true);
    }
  }, [setHeaders]);

  const signOut = useCallback(() => {
    removeAuthStateFromStorage();

    api.defaults.headers = {};

    setData({} as AuthState);
    setIsSigned(false);
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

      if (
        handledAuthState.organizations &&
        !handledAuthState.selectedOrganization
      ) {
        if (handledAuthState.organizations.length === 0) {
          throw new Error('There is no organization associated with this user');
        }

        if (handledAuthState.organizations.length === 1) {
          [
            handledAuthState.selectedOrganization,
          ] = handledAuthState.organizations;
        } else {
          setData(handledAuthState);
          setToChooseOrganization(true);
          return;
        }
      }

      setToChooseOrganization(false);
      setAuthStateToStorage(handledAuthState);
      setHeaders(handledAuthState);
      setIsSigned(true);
    },
    [setHeaders],
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

  const handleCloseChoosingOrganization = useCallback(() => {
    setToChooseOrganization(false);
  }, []);

  const chooseOrganization = useCallback(
    async (organization: Organization) => {
      handleSignIn({
        user: data.user,
        token: data.token,
        organizations: data.organizations,
        selectedOrganization: organization,
      });
    },
    [handleSignIn, data],
  );

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        isSigned,
        signIn,
        signInGoogle,
        chooseOrganization,
        setHeaders,
        signOut,
        updateUser,
      }}
    >
      {children}
      {data.organizations && toChooseOrganization && (
        <ChooseOraganizationContainer
          organizations={data.organizations}
          toOpen={toChooseOrganization}
          onRequestClose={handleCloseChoosingOrganization}
        />
      )}
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
