import { ApiResponseOptions } from '@nestjs/swagger';

export const okSchema: ApiResponseOptions = {
  description: ``,
  schema: {
    properties: {
      message: {
        type: 'string',
        example: 'Comment edited successfully',
      },
    },
  },
};
