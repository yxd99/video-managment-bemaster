import { ApiResponseOptions } from '@nestjs/swagger';

export const okSchema: ApiResponseOptions = {
  description: `The comment was published successfully.`,
  schema: {
    properties: {
      message: {
        type: 'string',
        example: 'comment publish successful',
      },
    },
  },
};
