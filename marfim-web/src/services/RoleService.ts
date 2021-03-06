import { IRole } from '../model/Role';
import GenericService from './GenericService';

export default class RoleService extends GenericService<IRole, number> {
  constructor() {
    super('/role');
  }

  public getRoles(ignoreTenantId = false): Promise<IRole[]> {
    const args = ignoreTenantId === true ? `?ignoreTenantId=true` : undefined;
    return this.findAll(args);
  }

  public createRole(role: IRole): Promise<IRole> {
    return this.create(role);
  }

  public getRole(roleId: number): Promise<IRole> {
    return this.findOne(roleId);
  }

  public updateRole(role: IRole): Promise<IRole> {
    if (!role.id) {
      throw new Error('Missing role id');
    }
    return this.update(role.id, role);
  }

  public deleteRole(roleId: number): Promise<IRole> {
    return this.delete(roleId);
  }
}
