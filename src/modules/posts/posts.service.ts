import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const user = await this.prisma.users.findUnique({
      where: { usr_user_name: createPostDto.usr_user_name },
    });

    if (!user) {
      throw new HttpException(
        'Usuário não econtrado!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    await this.prisma.posts.create({
      data: {
        pst_uuid: uuidv4(),
        pst_usr_id: user.usr_id,
        pst_content: createPostDto.pst_content,
      },
    });

    return { message: 'Post criado com sucesso!' };
  }

  async findOneByUUID(pst_uuid: string) {
    const post = await this.prisma.posts.findUnique({
      select: {
        pst_uuid: true,
        pst_content: true,
        pst_createdAt: true,
        users: {
          select: {
            usr_user_name: true,
            usr_name: true,
            profile: {
              select: {
                prf_image: true,
                prf_bio: true,
                prf_followers: true,
                prf_followings: true,
              },
            },
          },
        },
        comments: {
          select: {
            cmt_uuid: true,
            cmt_content: true,
            cmt_createdAt: true,
          },
        },
      },
      where: { pst_uuid },
    });

    if (!post) {
      throw new HttpException('', HttpStatus.NO_CONTENT);
    }

    return post;
  }

  async findAllFollowingPostsByUserName(usr_user_name: string) {
    const posts = await this.prisma.$queryRawUnsafe(`
      SELECT
        p.pst_uuid,
        p.pst_content,
        p.pst_createdAt,
        c.cmt_uuid,
        c.cmt_content,
        c.cmt_createdAt,
        u.usr_user_name,
        u.usr_name
      FROM posts p
      INNER JOIN users u
      ON p.pst_usr_id = u.usr_id
      LEFT JOIN comments c
      ON p.pst_id = c.cmt_pst_id
      WHERE u.usr_user_name = '${usr_user_name}'
      OR u.usr_id IN (
        SELECT f.frd_usr_following_id FROM friendships f
        INNER JOIN users u1 ON f.frd_usr_follower_id = u1.usr_id
        WHERE u1.usr_user_name = '${usr_user_name}'
      )
      ORDER BY p.pst_id DESC;`);

    return posts;
  }

  // async update(id: number, updatePostDto: UpdatePostDto) {
  //   await this.findOne(id);

  //   const editPost = await this.postRepository.preload({
  //     id: id,
  //     ...updatePostDto,
  //   });

  //   await this.postRepository.save(editPost);
  //   return { msg: 'Post editado com sucesso!' };
  // }

  // async remove(id: number) {
  //   const post = await this.findOne(id);
  //   await this.postRepository.delete(post);
  //   return { msg: 'Post deletado com sucesso!' };
  // }
}
