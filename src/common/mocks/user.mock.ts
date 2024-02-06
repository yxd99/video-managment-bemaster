import { User } from '@api/users/entities/user.entity';

export const userMock: User = {
  email: '',
  checkPassword: () => Promise.resolve(true),
  id: 1,
  password: '',
  removedAt: new Date(),
  username: '',
  videos: [],
};
