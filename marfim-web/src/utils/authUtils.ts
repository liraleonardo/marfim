import api from '../services/api';
import { getAuthStateFromStorage } from './storageService';

export function isAuthenticated(): boolean {
  const { user, token } = getAuthStateFromStorage();
  return !!user && !!token;
}
