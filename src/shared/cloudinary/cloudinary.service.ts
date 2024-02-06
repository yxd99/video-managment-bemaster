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

  async removeFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      v2.api.delete_resources(
        [publicId],
        { type: 'upload', resource_type: 'video' },
        (error, result) => {
          if (error) {
            this.logger.error(`eror to try delete the video: ${error.message}`);
            reject(error);
          }

          this.logger.log(`video with cloudinary id ${publicId} removed`);
          resolve(result);
        },
      );
    });
  }
}
