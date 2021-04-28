import User from '../model/User';
import GenericService from './GenericService';

export default class UserService extends GenericService<User, string> {
  constructor() {
    super('/user');
  }

  public getUsers(): Promise<User[]> {
    return this.findAll();
  }

  public createUser(user: User): Promise<User> {
    return this.create(user);
  }

  public getUser(userId: string): Promise<User> {
    return this.findOne(userId);
  }

  public updateUser(user: User): Promise<User> {
    if (!user.id) {
      throw new Error('Missing user id');
    }
    return this.update(user.id, user);
  }

  public deleteUser(userId: string): Promise<User> {
    return this.delete(userId);
  }
}
