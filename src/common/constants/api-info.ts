export const TITLE = 'Video Management BE-Master';
export const DESCRIPTION = `This API makes it easy for users to publish videos publicly or privately. 
                            To use the video publishing feature, it is necessary for the user to be 
                            registered on the platform. However, registration is not required to view 
                            public videos. On the other hand, to access private videos, as well as to 
                            comment and 'like' any video, it is essential to be authenticated in the account.`;
export const VERSION = 'v1';
export const PREFIX = 'api';
export const PORT = process.env.PORT ?? 3000;
export const SERVERS = [
  {
    host: `http://localhost:${PORT}/api`,
    description: 'Dev',
  },
];
