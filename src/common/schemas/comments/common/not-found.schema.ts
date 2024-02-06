import { ApiResponseOptions } from '@nestjs/swagger';

export const notFoundSchema: ApiResponseOptions = {
  description: `The requested comment was not found. Check the 'message' property for details.`,
  schema: {
    properties: {
      path: {
        type: 'string',
        example: '/api/comments/1',
      },
      timestamp: {
        type: 'string',
        example: '2024-02-05T00:44:15.951Z',
      },
      status: {
        type: 'number',
        example: 404,
      },
      message: {
        type: 'string',
        example: 'Comment not found',
      },
    },
  },
};
