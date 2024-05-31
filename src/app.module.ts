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
import { BullModule } from '@nestjs/bull';
import { MailService } from './mail/mail.service';
import { MailProcessor } from './mail/mail.processor';
import { EmailSenderService } from './mail/email-sender.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'emailQueue',
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService, UserService, PostService, BcryptService, AuthService, JwtService, MailService, MailProcessor, EmailSenderService],
})
export class AppModule {}
