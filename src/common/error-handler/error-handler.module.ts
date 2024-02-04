import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { CustomErrorFilter } from './custom-error.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
  ],
})
export class ErrorHandlerModule {}
