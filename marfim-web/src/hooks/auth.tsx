import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import ChooseOraganizationContainer from '../components/ChooseOrganizationContainer';
import api from '../services/api';
import setApiHeaders from '../utils/authUtils';
import {
  getAuthStateFromStorage,
  removeAuthStateFromStorage,
  setAuthStateToStorage,
} from '../utils/storageService';

export interface Organization {
  id: number;
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
  selectedOrganization: Organization;
  organizations: Organization[];
  isSigned: boolean;
  loadingAuthentication: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signInGoogle(token: string): Promise<boolean>;
  chooseOrganization(organization: Organization): void;
  setAuthState(authState: AuthState): void;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [isSigned, setIsSigned] = useState(false);
  const [loadingAuthentication, setLoadingAuthentication] = useState(true);
  const [choosingOrganization, setChoosingOrganization] = useState(false);

  const setAuthState = useCallback((authState: AuthState) => {
    const tenantID = authState.selectedOrganization?.id;
    setApiHeaders(authState.token, tenantID);
    setData(authState);
    if (authState.token && authState.user) {
      setIsSigned(true);
    } else {
      setIsSigned(false);
    }
  }, []);

  useEffect(() => {
    const authState = getAuthStateFromStorage();
    setAuthState(authState);
    setLoadingAuthentication(false);
  }, [setAuthState]);

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
          setChoosingOrganization(true);
          return;
        }
      }

      setChoosingOrganization(false);
      setAuthStateToStorage(handledAuthState);
      setAuthState(handledAuthState);
    },
    [setAuthState],
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
    setChoosingOrganization(false);
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
        selectedOrganization:
          data.selectedOrganization ||
          ({
            name: 'SUPER_USER',
          } as Organization),
        organizations: data.organizations || [],
        isSigned,
        loadingAuthentication,
        signIn,
        signInGoogle,
        chooseOrganization,
        setAuthState,
        signOut,
        updateUser,
      }}
    >
      {children}
      {data.organizations && choosingOrganization && (
        <ChooseOraganizationContainer
          organizations={data.organizations}
          toOpen={choosingOrganization}
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
