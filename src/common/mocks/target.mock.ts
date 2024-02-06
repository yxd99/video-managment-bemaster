import { Target } from '@api/likes/entities/target.entity';

import { commentMock } from './comment.mock';
import { videoMock } from './video.mock';

export const targetMock: Target = {
  comment: commentMock,
  id: 1,
  targetType: '',
  video: videoMock,
  removedAt: new Date(),
};
