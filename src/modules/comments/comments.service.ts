import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Post } from 'src/modules/posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const post = new Post();
    const user = new User();
    const comment = new Comment();

    comment.content = createCommentDto.content;

    user.id = +createCommentDto.userId;
    post.id = +createCommentDto.postId;

    comment.user = user;
    comment.post = post;

    return this.commentRepository.save(comment);
  }

  findAll() {
    return `This action returns all comments`;
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOneBy({ id });

    if (!comment) throw new NotFoundException('Comentatio não encontrado!');

    return comment;
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
