import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';
import { BcryptService } from './utils/bcrypt.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService, UserService, PostService, BcryptService, AuthService, JwtService],
})
export class AppModule {}
