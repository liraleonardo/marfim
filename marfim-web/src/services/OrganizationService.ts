import Organization from '../model/Organization';
import GenericService from './GenericService';

export default class OrganizationService extends GenericService<
  Organization,
  number
> {
  constructor() {
    super('/organization');
  }

  public getOrganizations(): Promise<Organization[]> {
    return this.findAll();
  }

  public createOrganization(organization: Organization): Promise<Organization> {
    return this.create(organization);
  }

  public getOrganization(organizationId: number): Promise<Organization> {
    return this.findOne(organizationId);
  }

  public updateOrganization(organization: Organization): Promise<Organization> {
    if (!organization.id) {
      throw new Error('Missing organization id');
    }
    return this.update(organization.id, organization);
  }

  public deleteOrganization(organizationId: number): Promise<Organization> {
    return this.delete(organizationId);
  }
}
