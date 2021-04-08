export default class Organization {
  public id?: number;

  public cnpj: string;

  public name: string;

  public description?: string;

  public avatarUrl?: string;

  public createdAt?: Date;

  public updatedAt?: Date;

  public enabled?: Date;

  constructor() {
    this.name = '';
    this.cnpj = '';
  }
}
