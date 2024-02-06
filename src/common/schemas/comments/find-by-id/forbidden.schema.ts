import { ApiResponseOptions } from '@nestjs/swagger';

export const forbiddenSchema: ApiResponseOptions = {
  description: `Access to this comment is forbidden. Check the 'message' property for details.`,
  schema: {
    properties: {
      path: {
        type: 'string',
        example: '/api/comments/3',
      },
      timestamp: {
        type: 'string',
        example: '2024-02-05T00:56:48.811Z',
      },
      status: {
        type: 'number',
        example: 403,
      },
      message: {
        type: 'string',
        example: 'This comment belongs to a private video',
      },
    },
  },
};
