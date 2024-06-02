import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ConflictException,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';
import { PrismaService } from './services/prisma.service';
import { User as UserModel, Post as PostModel, SharedWithMePost } from '@prisma/client';
import { BcryptService } from './utils/bcrypt.service';
import { LoginRequestDto } from './models/user.model';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { MailRecipientDto } from './mail/mail.dto';

@Controller('api')
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Get('tweets')
  async getAllTweats(): Promise<PostModel[]> {
    return this.postService.posts({});
  }

  @Get('tweets/:id')
  async getPostById(@Param('id') id: number): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @UseGuards(AuthGuard)
  @Get('my-tweets')
  async getMyPost(@Request() request: Request): Promise<PostModel[]> {
    const user = request['user'];
    return this.postService.myPost(user.email);
  }

  @UseGuards(AuthGuard)
  @Post('tweets')
  async createTweat(
    @Body() postData: { title: string; content?: string },
    @Request() request: Request,
  ): Promise<PostModel> {
    const { title, content } = postData;
    const user = request['user'];
    const post = await this.postService.createPost({
      title,
      content,
      author: {
        connect: { email: user.email },
      },
    });

    return this.getPostById(post.id);
  }

  @Get('users')
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.users({});
  }

  @UseGuards(AuthGuard)
  @Post('share-tweet')
  async shareTweet(@Body() body: { tweetId: number; recipients: { email_address: string }[] }) {
    const tweetId = body.tweetId;
    const emails = body.recipients.map(recipient => recipient.email_address);

    console.log('emails', emails)
    await this.postService.shareTweet(tweetId, emails);

    return { message: 'Tweet shared successfully!' };
  }

  @UseGuards(AuthGuard)
  @Get('shared-with-me-tweets')
  async getMySharedTweets(@Request() request: Request): Promise<SharedWithMePost[]> {
    const user = request['user'];
    return this.postService.getSharedWithMeTweets(user.id);
  }
}