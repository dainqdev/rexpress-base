import { NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { Middleware, Unauthorized } from '@dainqdev/rexpress';
import { jwtSecretKey } from '../../config/env';

import { userTokenPayload } from './types';
import { Req, Res } from '../../lib';

class AuthMiddleware extends Middleware {
  override get requireAuth() {
    return true;
  }
  async callback(req: Req, _res: Res, next: NextFunction): Promise<void> {
    if (req.user) {
      return await Promise.resolve(next());
    }
    let token = req.headers.authorization;
    if (typeof token !== 'string') {
      throw Unauthorized();
    } else if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
      if (!token) {
        throw Unauthorized();
      }
    }

    try {
      console.log('verify(token, jwtSecretKey)', verify(token, jwtSecretKey));

      const userDataInToken = userTokenPayload.parse(verify(token, jwtSecretKey));

      if (!this.requirer(userDataInToken)) {
        throw Unauthorized();
      }
      req.user = userDataInToken;

      next();
    } catch (error) {
      throw Unauthorized();
    }
  }
}

export default AuthMiddleware;
