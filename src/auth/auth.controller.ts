import {
  BadRequestException,
    Body,
    ConflictException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
import { LoginRequestDto } from 'src/models/user.model';
import { AuthGuard } from './auth.guard';
import { User as UserModel, Post as PostModel } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';
import { BcryptService } from 'src/utils/bcrypt.service';
  
  @Controller('api/auth')
  export class AuthController {
    constructor(
      private authService: AuthService, 
      private readonly prisma: PrismaService, 
      private readonly bcrypt: BcryptService,
    ) {}
  
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    login(
        @Body() payload: LoginRequestDto
    ) {
        return this.authService.signIn(payload);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('register')
  async signupUser(
    @Body() payload: { name?: string; email: string, password: string },
    ): Promise<UserModel> {
      console.log('payload', payload);
      
      if (!payload.password) {
        throw new BadRequestException('Password is required');
      }

      const existingRecord = await this.prisma.user.count({
        where: { email: payload.email },
      });

      if (existingRecord > 0) {
        throw new ConflictException(`A user with the specified email: ${payload.email} already exists!`);
      }

      const hashed_password = await this.bcrypt.hashPassword(payload.password);
      payload.password = hashed_password;

      return this.authService.createUser(payload);
    }

    @Post('logout')
    @UseGuards(AuthGuard)
    async logout(@Req() req): Promise<void> {
      const authorization = req.headers.authorization ?? '';
      const accessToken = authorization.split(' ')[1] ?? '';

      await this.authService.logout(accessToken);
    }
  }