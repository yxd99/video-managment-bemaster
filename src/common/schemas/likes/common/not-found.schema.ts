import { ApiResponseOptions } from '@nestjs/swagger';

export const notFoundSchema: ApiResponseOptions = {
  description: `The requested video for liking or unliking was not found. Check the 'message' property for details.`,
  schema: {
    properties: {
      path: {
        type: 'string',
        example: '/api/likes/1',
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
        example: 'Video not found',
      },
    },
  },
};
