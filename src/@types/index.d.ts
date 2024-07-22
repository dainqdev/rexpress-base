declare type Remove<T, K extends keyof T> = Omit<T, K>;

namespace Rexpress {
  export type UserPayload = import('../middlewares/auth').UserTokenPayload;
}
