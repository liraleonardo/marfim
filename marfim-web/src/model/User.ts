import Organization from './Organization';

export default class User {
  public id?: string;

  public name: string;

  public email: string;

  public password?: string;

  public avatarUrl?: string;

  public createdAt?: Date;

  public updatedAt?: Date;

  public enabled?: boolean;

  public isSuper?: boolean;

  public organizations?: Organization[];

  constructor() {
    this.name = '';
    this.email = '';
    this.avatarUrl = '';
    this.organizations = [];
  }
}

export interface ICreateUpdateUser {
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  isSuper?: boolean;
  organizations?: Organization[];
}

export interface IUser {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  isSuper?: boolean;
}
