import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Post, Prisma } from '@prisma/client';
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
    });
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }


  async shareTweet(tweetId: number, recepients: string[]): Promise<void> {

    console.log('recepients', recepients)
    const mailData: MailDataDto = {
      recipients: recepients,
      from: 'testmail@smartapps.com.ng',
      subject: 'Check out this Tweet!',
      text: `Here is an interesting tweet for you: ${tweetId}`,
      html: `<p>Here is an interesting tweet for you: <a href="http://localhost:3000/tweet/${tweetId}">View Tweet</a></p>`,
    };

    await this.mailService.sendEmail(mailData);

    console.log('Tweet shared successfully!', mailData);
  }
}