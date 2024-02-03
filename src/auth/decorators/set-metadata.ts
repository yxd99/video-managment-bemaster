import { publicData } from '@/constants';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(publicData.PUBLIC_KEY, true);
