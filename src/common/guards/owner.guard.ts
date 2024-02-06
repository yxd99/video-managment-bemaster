import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.user;

    const resourceId = context.getArgByIndex(0).params.id;

    const isOwner = userId === resourceId;

    if (!isOwner) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action.',
      );
    }

    return isOwner;
  }
}
