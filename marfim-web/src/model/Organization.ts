export default class Organization {
  public id?: number;

  public cnpj: string;

  public name: string;

  public description?: string;

  public avatarUrl?: string;

  public createdAt?: Date;

  public updatedAt?: Date;

  public enabled?: boolean;

  constructor() {
    this.name = '';
    this.cnpj = '';
    this.description = '';
    this.avatarUrl = '';
  }
}

export interface ICreateUpdateOrganization {
  cnpj: string;
  name: string;
  description?: string;
  avatarUrl?: string;
}

export interface IOrganization {
  id?: number;
  name: string;
  avatarUrl?: string;
}
