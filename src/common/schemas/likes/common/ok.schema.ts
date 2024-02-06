import { ApiResponseOptions } from '@nestjs/swagger';

export const okSchema: ApiResponseOptions = {
  description: `Successful response indicating that the like was removed or sent.`,
  schema: {
    anyOf: [
      {
        properties: {
          message: {
            type: 'string',
            example: 'Like removed',
          },
        },
      },
      {
        properties: {
          message: {
            type: 'string',
            example: 'Like sended successful',
          },
        },
      },
    ],
  },
};
