import { ApiResponseOptions } from '@nestjs/swagger';

export const okSchema: ApiResponseOptions = {
  description: `Successful response containing the list of comments.`,
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        text: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
  },
};
