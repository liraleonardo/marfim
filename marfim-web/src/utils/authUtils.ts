import api from '../services/api';

export default function setApiHeaders(
  token: string,
  tenantID: number | undefined,
): void {
  api.defaults.headers = {};

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  if (tenantID) {
    api.defaults.headers['X-TenantID'] = `${tenantID}`;
  }
}
