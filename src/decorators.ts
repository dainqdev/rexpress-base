import { UserType } from '@prisma/client';

import { InjectMiddleware } from '@dainqdev/rexpress';
import { AuthMiddleware } from './middlewares';

export const Authorize = function (role?: UserType) {
  if (role) {
    return InjectMiddleware(AuthMiddleware, u => u?.type === role);
  }
  return InjectMiddleware(AuthMiddleware);
};
