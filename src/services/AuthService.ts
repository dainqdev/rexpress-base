import { sign } from 'jsonwebtoken';
import { Prisma, User } from '@prisma/client';

import { PrismaClient } from '../db';
import { LoginBody, RegisterBody } from '../controllers';
import { BadRequest, kdfSign, kdfVerify, NotFound, omit, Unauthorized } from '@dainqdev/rexpress';
import { jwtSecretKey } from '../config/env';
import { accessTokenLifeTime } from '../config/jwt';

export default class AuthService {
  constructor(private db: PrismaClient) {}
  async login(data: LoginBody) {
    const userData = await this.db.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!userData) {
      throw NotFound('User not found');
    }

    const isTruePassword = await kdfVerify(data.password, userData.password);

    if (!isTruePassword) {
      throw Unauthorized('Password not match');
    }

    const accessToken = this.signToken({
      id: userData.id,
      email: userData.email,
      type: userData.type,
    });

    return {
      accessToken,
      data: omit(userData, 'password'),
    };
  }

  async getUserById(userId: string) {
    const userData = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userData) {
      throw NotFound('User not found');
    }
    return omit(userData, 'password');
  }

  async getUsers() {
    const userData = await this.db.user.findMany({
      select: {
        id: true,
        email: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!userData) {
      throw NotFound('User not found');
    }
    return userData;
  }

  async register(user: RegisterBody) {
    const passwordHash = await kdfSign(user.password);
    return await this.db.$transaction(async db => {
      const userData = await db.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (userData) {
        throw NotFound('Email already registered');
      }
      const newUser = await db.user.create({
        data: {
          ...user,
          password: passwordHash,
        },
      });

      return {
        id: newUser.id,
      };
    });
  }

  private signToken(user: Pick<User, 'id' | 'email' | 'type'>) {
    return sign(user, jwtSecretKey, {
      expiresIn: accessTokenLifeTime,
    });
  }
}
