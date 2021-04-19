import axios from 'axios';
import {
  getTenantIDFromStorage,
  getTokenFromStorage,
} from '../utils/storageService';

const api = axios.create({
  baseURL: 'http://localhost:8082',
});

// include headers based on storage values for token and tenant-ID
api.interceptors.request.use((req) => {
  req.headers = {};
  const token = getTokenFromStorage();
  const tenantID = getTenantIDFromStorage();

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  if (tenantID) {
    req.headers['X-TenantID'] = `${tenantID}`;
  }

  return req;
});

export default api;
