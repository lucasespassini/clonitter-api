import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const newComment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(newComment);
  }

  findAll() {
    return `This action returns all comments`;
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

  async addLike(id: number) {
    const comment = await this.findOne(id);
    comment.likes += 1;
    return this.commentRepository.save(comment);
  }

  async removeLike(id: number) {
    const comment = await this.findOne(id);

    if (comment.likes == 0) return comment;

    comment.likes -= 1;
    return this.commentRepository.save(comment);
  }
}
