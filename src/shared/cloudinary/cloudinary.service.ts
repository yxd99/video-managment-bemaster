import { Injectable, Logger } from '@nestjs/common';
import * as toStream from 'buffer-to-stream';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'video' },
        (error, result) => {
          if (error) {
            this.logger.error(error);
            reject(error);
          }
          this.logger.log(`Video uploaded with url ${result.secure_url}`);

          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}
