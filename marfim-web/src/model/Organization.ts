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
  }
}

export interface ICreateUpdateOrganization {
  // id?: number;
  cnpj: string;
  name: string;
  description?: string;
  avatarUrl?: string;
}
