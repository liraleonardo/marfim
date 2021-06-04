import { AxiosInstance } from 'axios';
import IMenuItem from '../model/IMenuItem';
import api from './api';

export default class MenuService {
  protected api: AxiosInstance = api;

  public path = 'menu-items';

  public getMenuItems(): Promise<IMenuItem[]> {
    return this.api.get<IMenuItem[]>(this.path).then((res) => res.data);
  }
}
