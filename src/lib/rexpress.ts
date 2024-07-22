import { Request, Response } from '@dainqdev/rexpress';

export type Req<T = any> = Request<T>;
export type Res = Response;
