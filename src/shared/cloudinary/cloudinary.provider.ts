import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';

const configService = new ConfigService();
export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): void => {
    v2.config({
      cloud_name: configService.get<string>('CLOUDINARY_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  },
};
