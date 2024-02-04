import { ApiResponseOptions } from '@nestjs/swagger';

export const createdSchema: ApiResponseOptions = {
  description: `The resource has been successfully created. The response includes a 
                token in the "token" property, which can be used for authentication 
                and authorization purposes.`,
  schema: {
    properties: {
      token: {
        type: 'string',
        example: 'jwt',
      },
    },
  },
};
