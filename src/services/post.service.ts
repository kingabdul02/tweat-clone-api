import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Post, Prisma, SharedWithMePost } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { MailService } from 'src/mail/mail.service';
import { MailDataDto, MailRecipientDto } from 'src/mail/mail.dto';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private readonly mailService: MailService
    ) {}

  async post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
      include: {
        author: true
      }
    });
  }

  async myPost(authorEmail: string): Promise<Post[]> {
    console.log('authorEmail', authorEmail)
    return this.prisma.post.findMany({
      where: {
        author: {
          email: authorEmail,
        },
      },
      include: {
        author: true
      }
    });
  }  

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        author: true
      }
    });
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }


  async shareTweet(tweetId: number, recipients: string[]): Promise<void> {

    console.log('recipients', recipients)
    const mailData: MailDataDto = {
      recipients: recipients,
      from: 'testmail@smartapps.com.ng',
      subject: 'Check out this Tweet!',
      text: `Here is an interesting tweet for you: ${tweetId}`,
      html: `<p>Here is an interesting tweet for you: <a href="http://localhost:5173/tweet/${tweetId}">View Tweet</a></p>`,
    };

    await this.mailService.sendEmail(mailData);

    console.log('Tweet shared successfully!', mailData);

    for (const email of recipients) {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (user) {
        await this.prisma.sharedWithMePost.create({
          data: {
            sharedId: user.id,
            postId: tweetId,
          },
        });
      }
    }
  }

  async getSharedWithMeTweets(userId: number): Promise<SharedWithMePost[]> {
    return this.prisma.sharedWithMePost.findMany({
      where: { sharedId: userId },
      include: { 
        sharedPost: {
          include: {
            author: true
          }
        } 
      },
    });
  }
}