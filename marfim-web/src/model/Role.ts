import Organization from './Organization';
import User from './User';

export default class Role {
  public id?: string;

  public name: string;

  public description?: string;

  public isAdmin?: boolean;

  public organization: Organization;

  public permissions?: any[];

  public users?: User[];

  constructor(organizationId: number) {
    this.name = '';
    this.organization = new Organization();
    this.organization.id = organizationId;
    this.isAdmin = false;
  }
}

export interface IPermission {
  levelCode: string;
  levelName: string;
  resourceCode: string;
  resourceName: string;
  authority: string;
}

export interface IPermissionGroup {
  label: string;
  permissions: IPermission[];
}

export interface IRole {
  id?: number;
  name: string;
  description?: string;
  isAdmin?: boolean;
  usersNumber?: number;
  permissionsNumber?: number;
}
