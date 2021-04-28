import { AuthState } from '../hooks/auth';

const STORAGE_KEY = {
  token: '@Marfim:token',
  user: '@Marfim:user',
  organizations: '@Marfim:organizations',
  selectedOrganization: '@Marfim:selectedOrganization',
};

export function getTokenFromStorage(): string | null {
  return localStorage.getItem(STORAGE_KEY.token);
}

export function getTenantIDFromStorage(): number | null {
  const storageSelectedOrganization = localStorage.getItem(
    STORAGE_KEY.selectedOrganization,
  );

  if (storageSelectedOrganization) {
    const selectedOrganization: { id: number } = JSON.parse(
      storageSelectedOrganization,
    );

    return selectedOrganization.id;
  }

  return null;
}

export function getAuthStateFromStorage(): AuthState {
  const authState: AuthState = {} as AuthState;
  const storageToken = localStorage.getItem(STORAGE_KEY.token);
  const storageUser = localStorage.getItem(STORAGE_KEY.user);
  const storageOrganizations = localStorage.getItem(STORAGE_KEY.organizations);
  const storageSelectedOrganization = localStorage.getItem(
    STORAGE_KEY.selectedOrganization,
  );

  if (storageToken) {
    authState.token = storageToken;
  }

  if (storageUser) {
    authState.user = JSON.parse(storageUser);
  }

  if (storageOrganizations) {
    authState.organizations = JSON.parse(storageOrganizations);
  }

  if (storageSelectedOrganization) {
    authState.selectedOrganization = JSON.parse(storageSelectedOrganization);
  }

  // console.log('storage: ', authState);
  return authState;
}

export function setAuthStateToStorage({
  token,
  user,
  organizations,
  selectedOrganization,
}: AuthState): void {
  if (token) localStorage.setItem(STORAGE_KEY.token, token);
  if (user) localStorage.setItem(STORAGE_KEY.user, JSON.stringify(user));
  if (organizations)
    localStorage.setItem(
      STORAGE_KEY.organizations,
      JSON.stringify(organizations),
    );
  if (selectedOrganization)
    localStorage.setItem(
      STORAGE_KEY.selectedOrganization,
      JSON.stringify(selectedOrganization),
    );
}

export function removeAuthStateFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY.token);
  localStorage.removeItem(STORAGE_KEY.user);
  localStorage.removeItem(STORAGE_KEY.organizations);
  localStorage.removeItem(STORAGE_KEY.selectedOrganization);
}
