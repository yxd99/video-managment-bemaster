import { Like } from '@api/likes/entities/like.entity';

import { targetMock } from './target.mock';

export const likeMock: Like = {
  id: 1,
  target: targetMock,
  userId: 1,
  status: true,
};
