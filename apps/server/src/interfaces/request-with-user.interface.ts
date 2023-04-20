import { UserEntity } from '../app/users/entities/user.entity';

// Request interface with user
export interface RequestWithUser extends Request {
  user: UserEntity;
}
