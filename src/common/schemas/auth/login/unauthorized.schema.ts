import { ApiResponseOptions } from '@nestjs/swagger';

export const unauhtorizedSchema: ApiResponseOptions = {
  description: `The request was not authorized due to an incorrect password. 
                Check the 'message' property for details.`,
  schema: {
    properties: {
      path: {
        type: 'string',
        example: '/api/auth/login',
      },
      timestamp: {
        type: 'string',
        example: '2024-02-04T23:16:49.109Z',
      },
      status: {
        type: 'number',
        example: 401,
      },
      message: {
        type: 'string',
        example: 'Incorrect password.',
      },
    },
  },
};
