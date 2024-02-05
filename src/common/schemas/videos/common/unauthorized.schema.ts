import { ApiResponseOptions } from '@nestjs/swagger';

export const unauhtorizedSchema: ApiResponseOptions = {
  description: `The request requires user authentication. Check the 'message' property for details.`,
  schema: {
    properties: {
      path: {
        type: 'string',
        example: '/api/videos/1',
      },
      timestamp: {
        type: 'string',
        example: '2024-02-05T00:01:08.955Z',
      },
      status: {
        type: 'number',
        example: 401,
      },
      message: {
        type: 'object',
        properties: {
          details: {
            type: 'string',
            example: 'Unauthorized',
          },
        },
      },
    },
  },
};
