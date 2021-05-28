import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import ChooseOraganizationContainer from '../components/ChooseOrganizationContainer';
import api from '../services/api';
import { isAuthenticated } from '../utils/authUtils';
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
  authorities: string[];
  hasAnyAuthority(authoritiesToFind: string[]): boolean;
  selectedOrganization: Organization;
  organizations: Organization[];
  authenticated: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signInGoogle(token: string): Promise<boolean>;
  chooseOrganization(organization: Organization): void;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [authorities, setAuthorities] = useState<string[]>([]);
  const [choosingOrganization, setChoosingOrganization] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const fetchAuthorities = useCallback(async () => {
    try {
      const { data: fetchedAuthorities } = await api.get('/my/authorities');
      setAuthorities(fetchedAuthorities);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    const authState = getAuthStateFromStorage();
    if (isAuthenticated()) {
      setAuthenticated(true);
      fetchAuthorities();
    }
    setData(authState);
  }, [setData, fetchAuthorities]);

  const signOut = useCallback(() => {
    removeAuthStateFromStorage();
    setData({} as AuthState);
    setAuthorities([]);
    setAuthenticated(false);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@Marfim:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
        organizations: data.organizations,
        selectedOrganization: data.selectedOrganization,
      });
    },
    [setData, data],
  );

  const handleSignIn = useCallback(
    (authState: AuthState) => {
      const { user } = authState;
      const handledAuthState: AuthState = authState;

      if (
        handledAuthState.organizations &&
        handledAuthState.organizations.length === 0
      ) {
        if (!user.isSuper)
          throw new Error('There is no organization associated with this user');
        handledAuthState.organizations = undefined;
        handledAuthState.selectedOrganization = undefined;
      }

      if (
        handledAuthState.organizations &&
        !handledAuthState.selectedOrganization
      ) {
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
      setData(handledAuthState);
      setAuthenticated(true);
      fetchAuthorities();
    },
    [setData, fetchAuthorities],
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

  const hasAnyAuthority = useCallback(
    (authoritiesToFind: string[]): boolean => {
      const authoritiesFound = authorities.filter((authority) => {
        return authoritiesToFind.includes(authority);
      });
      return authoritiesFound && authoritiesFound.length > 0;
    },
    [authorities],
  );

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        authorities,
        hasAnyAuthority,
        selectedOrganization:
          data.selectedOrganization ||
          ({
            name: 'SUPER_USER',
          } as Organization),
        organizations: data.organizations || [],
        authenticated,
        signIn,
        signInGoogle,
        chooseOrganization,
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
