import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';

// this is just an example for a custom repository

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByUsername(username: string) {
    return this.findByUsername(username);
  }
}
