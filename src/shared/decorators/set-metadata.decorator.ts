import { SetMetadata } from '@nestjs/common';

import { publicData } from '@common/constants';

export const Public = () => SetMetadata(publicData.PUBLIC_KEY, true);
