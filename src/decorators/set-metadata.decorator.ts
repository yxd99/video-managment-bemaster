import { SetMetadata } from '@nestjs/common';

import { publicData } from '@root/constants';

export const Public = () => SetMetadata(publicData.PUBLIC_KEY, true);
