import {
  json,
  Controller,
  Post,
  ControllerTag,
  ApiProperty,
  HttpStatus,
  Get,
  ApiResponseOk,
  ApiListResponseOk,
} from '@dainqdev/rexpress';

import { AuthService } from '../../services';
import { LoginBody, RegisterBody, loginBody, loginReponse, registerBody } from './types';
import { Req, Res } from '../../lib';
import { Authorize } from '../../decorators';
import { UserSchema } from '../../db';

@Controller()
@ControllerTag('Auth')
class AuthController {
  constructor(private authService: AuthService) {}

  @ApiProperty({
    response: {
      [HttpStatus.OK]: loginReponse,
    },
  })
  @Post('/login', loginBody)
  async login(req: Req<LoginBody>, res: Res) {
    json(res, await this.authService.login(req.body));
  }

  @Post('/register', registerBody)
  async register(req: Req<RegisterBody>, res: Res) {
    json(res, await this.authService.register(req.body));
  }

  @Get('/me')
  @ApiProperty('User')
  @Authorize()
  @ApiResponseOk(UserSchema.omit({ password: true }))
  async getMe(req: Req) {
    return await this.authService.getUserById(req.user!.id);
  }

  @Get('/users')
  @ApiProperty('User')
  @Authorize()
  @ApiListResponseOk(UserSchema.omit({ password: true }), 'User')
  async getUsers(req: Req) {
    return await this.authService.getUsers();
  }
}

export default AuthController;
