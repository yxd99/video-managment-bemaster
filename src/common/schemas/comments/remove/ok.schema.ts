import { ApiResponseOptions } from '@nestjs/swagger';

export const okSchema: ApiResponseOptions = {
  description: `Successful response indicating that the comment was removed successfully.`,
  schema: {
    properties: {
      message: {
        type: 'string',
        example: 'Comment removed successfully',
      },
    },
  },
};
