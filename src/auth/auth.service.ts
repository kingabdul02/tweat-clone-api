import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { LoginRequestDto, LoginResponseDto } from 'src/models/user.model';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { BcryptService } from 'src/utils/bcrypt.service';
import { dayInMinutes } from 'src/utils/date-helper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
    ) {}

  async signIn(payload: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: payload.email }
    });

    if (
      !user ||
      !(await this.bcrypt.comparePasswords(
        payload.password,
        user.password
      ))
    ) {
      throw new UnauthorizedException(
        'Invalid Credentials! Please check and try again...'
      );
    }
    
    await this.prisma.userLoginEntry.deleteMany({
      where: { user_id: user.id }
    });

    const tokenEntry =
      await this.prisma.userLoginEntry.create({
        data: {
          expires_in: dayInMinutes,
          user_id: user.id
        }
      });

    const response: LoginResponseDto = {
      access_token: tokenEntry.access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };

    return response;
  }


  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}