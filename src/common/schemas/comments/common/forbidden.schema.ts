import { ApiResponseOptions } from '@nestjs/swagger';

export const forbiddenSchema: ApiResponseOptions = {
  description: `Access to modify or delete this comment is forbidden as you are not the owner. Check the 'message' property for details.`,
  schema: {
    properties: {
      path: {
        type: 'string',
        example: '/api/comments/3',
      },
      timestamp: {
        type: 'string',
        example: '2024-02-05T01:33:23.257Z',
      },
      status: {
        type: 'number',
        example: 403,
      },
      message: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Forbidden',
          },
          details: {
            type: 'string',
            example: 'You are not the owner of this comment',
          },
        },
      },
    },
  },
};
