import { ApiResponseOptions } from '@nestjs/swagger';

export const notFoundSchema: ApiResponseOptions = {
  description: `The requested video for commenting or to retrieve comments was not found. Check the 'message' property for details.`,
  schema: {
    properties: {
      path: {
        type: 'string',
        example: '/api/comments/1',
      },
      timestamp: {
        type: 'string',
        example: '2024-02-04T23:49:10.832Z',
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
