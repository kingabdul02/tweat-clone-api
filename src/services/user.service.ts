import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma } from '@prisma/client';
import { BcryptService } from '../utils/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
    ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users({}): Promise<User[]> {
    // const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }
}