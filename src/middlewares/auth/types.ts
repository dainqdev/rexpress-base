import { UserType } from '@prisma/client';
import { z } from 'zod';

export const userTokenPayload = z.object({
  // id: z.string().length(36), // uuid
  id: z.string().length(24), // mongoid
  email: z.string().email(),
  type: z.nativeEnum(UserType),
});

export type UserTokenPayload = z.infer<typeof userTokenPayload>;
