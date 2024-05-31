import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Post, Prisma } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

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

  async shareTweet(tweatId: number, emails: string[]): Promise<void> {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'mail.smartapps.com.ng', // Use your email service provider
      port: 465,
      secure: true,
      auth: {
        user: 'testmail@smartapps.com.ng', // Your email
        pass: '$R!_mn7748tR', // Your email password or app password
      },
    });

    // Compose the email
    const mailOptions = {
      from: 'testmail@smartapps.com.ng',
      to: emails.join(', '), // Join the emails array into a comma-separated string
      subject: 'Check out this Tweet!',
      text: `Here is an interesting tweet for you: ${tweatId}`, // Customize the email content
      html: `<p>Here is an interesting tweet for you: <a href="http://localhost:3000/tweet/${tweatId}">View Tweet</a></p>`, // Optionally use HTML
    };
    
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('email sennt');

  }
}