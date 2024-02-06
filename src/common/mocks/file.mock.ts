import { Readable } from 'stream';

export const createMockFile = (): Express.Multer.File => {
  const buffer = Buffer.from('contenido_del_video', 'utf-8');

  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const mockFile: Express.Multer.File = {
    fieldname: 'video',
    originalname: 'example-video.mp4',
    encoding: '7bit',
    mimetype: 'video/mp4',
    destination: '/tmp',
    filename: 'mocked-filename.mp4',
    path: '/tmp/mocked-filename.mp4',
    size: buffer.length,
    buffer,
    stream,
  };

  return mockFile;
};
