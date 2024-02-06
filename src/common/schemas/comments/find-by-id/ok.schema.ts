import { ApiResponseOptions } from '@nestjs/swagger';

export const okSchema: ApiResponseOptions = {
  description: `Successful response containing the comment with information about the associated video.`,
  schema: {
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
      video: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          title: { type: 'string' },
          description: { type: 'string' },
          url: { type: 'string', format: 'uri' },
          privacy: { type: 'string' },
          publicId: { type: 'string' },
          credits: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};
