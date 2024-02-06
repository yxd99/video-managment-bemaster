import { ApiResponseOptions } from '@nestjs/swagger';

export const badRequestSchema: ApiResponseOptions = {
  description: `The request is malformed or invalid. Check the 'message' property for details.`,
  schema: {
    properties: {
      path: {
        type: 'string',
        example: '/api/comments/asd',
      },
      timestamp: {
        type: 'string',
        example: '2024-02-04T23:37:33.491Z',
      },
      status: {
        type: 'number',
        example: 400,
      },
      message: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Bad Request',
          },
          details: {
            type: 'string',
            example: 'Validation failed (numeric string is expected)',
          },
        },
      },
    },
  },
};
