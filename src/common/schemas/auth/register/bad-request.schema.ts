import { ApiResponseOptions } from '@nestjs/swagger';

export const badRequestSchema: ApiResponseOptions = {
  description: `The server could not process the request due to invalid client data. 
                The response includes detailed information about the validation errors 
                in the "details" array of the "message" property. Developers should 
                review and address the specified issues with the request payload before 
                resubmitting the request.`,
  schema: {
    properties: {
      path: {
        type: 'string',
        example: '/api/auth/register',
      },
      timestamp: {
        type: 'string',
        example: '2024-02-04T21:59:14.196Z',
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
            type: 'array',
            items: {
              type: 'string',
            },

            example: [
              'username must be shorter than or equal to 10 characters',
              'username must be longer than or equal to 3 characters',
              'username must be a string',
              'email must be shorter than or equal to 50 characters',
              'email must be an email',
              'password must be shorter than or equal to 16 characters',
              'password must be longer than or equal to 8 characters',
              'password must be a string',
              'validatePassword must be shorter than or equal to 16 characters',
              'validatePassword must be longer than or equal to 8 characters',
              'validatePassword must be a string',
              'validatePassword and password does not match',
            ],
          },
        },
      },
    },
  },
};
