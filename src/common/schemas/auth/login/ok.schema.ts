import { ApiResponseOptions } from '@nestjs/swagger';

export const okSchema: ApiResponseOptions = {
  description: `The login was successful. Check the 'token' property for the authentication token.`,
  schema: {
    properties: {
      token: {
        type: 'string',
        example: 'jwt',
      },
    },
  },
};
