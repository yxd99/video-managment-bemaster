import { Comment } from '@api/comments/entities/comment.entity';

import { userMock } from './user.mock';
import { videoMock } from './video.mock';

export const commentMock: Comment = {
  createdAt: new Date(),
  deletedAt: new Date(),
  id: 1,
  text: '',
  updatedAt: new Date(),
  user: userMock,
  video: videoMock,
};
