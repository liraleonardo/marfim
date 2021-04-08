import { AxiosInstance } from 'axios';
import Organization from '../model/Organization';
import api from './api';

export default class OrganizationService {
  private api: AxiosInstance = api;

  // find all organizations
  public getOrganizations(): Promise<Organization[]> {
    return this.api
      .get<Organization[]>('/organization')
      .then((res) => res.data);
  }
}
