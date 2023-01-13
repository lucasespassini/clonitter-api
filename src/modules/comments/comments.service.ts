import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    const results = await Promise.all([
      this.prisma.users.findUnique({
        where: { usr_user_name: createCommentDto.usr_user_name },
      }),
      this.prisma.posts.findUnique({
        where: { pst_uuid: createCommentDto.pst_uuid },
      }),
    ]);

    const user = results[0];
    const post = results[1];

    const comment = await this.prisma.comments.create({
      data: {
        cmt_uuid: uuidv4(),
        cmt_content: createCommentDto.cmt_content,
        cmt_pst_id: post.pst_id,
        cmt_usr_id: user.usr_id,
      },
    });

    return comment;
  }
}
