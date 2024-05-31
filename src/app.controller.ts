import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ConflictException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';
import { PrismaService } from './services/prisma.service';
import { User as UserModel, Post as PostModel } from '@prisma/client';
import { BcryptService } from './utils/bcrypt.service';
import { LoginRequestDto } from './models/user.model';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
    private readonly authService: AuthService,
  ) {}

  @Get('tweats')
  async getAllTweats(): Promise<PostModel[]> {
    return this.postService.posts({});
  }

  @Get('tweat/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @Post('tweat')
  async createTweat(
    @Body() postData: { title: string; content?: string; authorEmail: string },
  ): Promise<PostModel> {
    const { title, content, authorEmail } = postData;
    return this.postService.createPost({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
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

  @Get('users')
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.users({});
  }

  @UseGuards(AuthGuard)
  @Post('share-tweet')
  async shareTweet(
    @Body('tweetId') tweetId: number,
    @Body('emails') emails: string[],
  ): Promise<void> {
    await this.postService.shareTweet(tweetId, emails);
  }
}