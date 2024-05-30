import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';
import { BcryptService } from './utils/bcrypt.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService, PostService, BcryptService],
})
export class AppModule {}