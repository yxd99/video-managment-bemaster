import { ApiResponseOptions } from '@nestjs/swagger';

export const conflictSchema: ApiResponseOptions = {
  description: `The server encountered a conflict while processing the request. 
                This typically occurs when the requested operation conflicts 
                with the current state of the resource, such as attempting to 
                create a resource that already exists. The response includes 
                information about the conflicting resource in the "message" 
                property. Developers should review the details provided to 
                understand the nature of the conflict and adjust the request 
                accordingly.`,
  schema: {
    properties: {
      path: {
        type: 'string',
        example: '/api/auth/register',
      },
      timestamp: {
        type: 'string',
        example: '2024-02-04T22:35:01.042Z',
      },
      status: {
        type: 'number',
        example: 409,
      },
      message: {
        type: 'string',
        example: 'Email jhon@doe.com already exists.',
      },
    },
  },
};
