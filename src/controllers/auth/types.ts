import { UserType } from '@prisma/client';
import { z } from 'zod';

import { UserSchema } from '../../db';

export const loginBody = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email field'),
  password: z
    .string({ message: 'Password is required' })
    .min(6, 'Password must contain at least 6 character(s)'),
});

// const loginNotFoundResponse = z.object({
//   "status": z.string().openapi({ examples: ["error"] }),
//   "code": z.number().openapi({ examples: [404] }),
//   "message": z.string().openapi({ examples: ["User email not found"] }),
// })

export const loginReponse = z.object({
  accessToken: z.string(),
  data: UserSchema,
});

export type LoginBody = z.infer<typeof loginBody>;

export const registerBody = z.object({
  email: z.string({ message: 'email is required' }).email('Invalid email field'),
  password: z
    .string({ message: 'password is required' })
    .min(6, 'password must contain at least 6 character(s)'),
  type: z.nativeEnum(UserType, { message: 'type is required (kol | project)' }),
});

export type RegisterBody = z.infer<typeof registerBody>;
