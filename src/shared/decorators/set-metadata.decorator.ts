import { publicData } from '@commons/constants';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(publicData.PUBLIC_KEY, true);
