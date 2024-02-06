import { ApiResponseOptions } from '@nestjs/swagger';

export const forbiddenSchema: ApiResponseOptions = {
  description: ``,
  schema: {
    properties: {
      path: {
        type: 'string',
        example: '/api/comments/video/3',
      },
      timestamp: {
        type: 'string',
        example: '2024-02-05T00:24:47.209Z',
      },
      status: {
        type: 'number',
        example: 403,
      },
      message: {
        type: 'string',
        example: 'These comments are from a private video',
      },
    },
  },
};
