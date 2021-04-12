import { AxiosInstance } from 'axios';
import api from './api';

export default class GenericService<T, K> {
  protected api: AxiosInstance = api;

  public path: string;

  constructor(path: string) {
    this.path = path;
  }

  public findAll(): Promise<T[]> {
    return this.api.get<T[]>(this.path).then((res) => res.data);
  }

  public create(object: T): Promise<T> {
    return this.api.post<T>(this.path, object).then((res) => res.data);
  }

  public findOne(id: K): Promise<T> {
    return this.api.get<T>(`${this.path}/${id}`).then((res) => res.data);
  }

  public update(id: K, object: T): Promise<T> {
    return this.api
      .put<T>(`${this.path}/${id}`, object)
      .then((res) => res.data);
  }

  public delete(id: K): Promise<T> {
    return this.api.delete<T>(`${this.path}/${id}`).then((res) => res.data);
  }
}
