import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Notification } from '../notifications/entities/notification.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const newComment = this.commentRepository.create(createCommentDto);
    try {
      return this.commentRepository.save(newComment);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: {
        post: true,
        user: true,
      },
    });

    if (!comment) throw new NotFoundException('Comentário não encontrado!');

    return comment;
  }

  async findAllCommentsByPostId(postUUID: string) {
    const post = await this.postRepository.findOneBy({ uuid: postUUID });

    if (!post) throw new NotFoundException('Post não encontrado!');

    const comments = await this.commentRepository
      .createQueryBuilder('comments')
      .innerJoin('comments.post', 'post')
      .where('post.uuid = :postUUID', { postUUID })
      .innerJoinAndSelect('comments.user', 'user')
      .orderBy('comments.id', 'ASC')
      .getMany();

    return comments;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
