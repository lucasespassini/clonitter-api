import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = new Post();
    const user = new User();
    post.content = createPostDto.content;
    user.id = +createPostDto.userId;
    post.user = user;
    await this.postRepository.save(post);
    return { msg: 'Post criado com sucesso!' };
  }

  async findAll() {
    const posts = await this.postRepository.find({
      order: { id: 'DESC', createdAt: 'DESC' },
      relations: ['comments', 'user'],
    });

    return posts;
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id: id },
      relations: ['comments'],
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado!');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findOne(id);

    const editPost = await this.postRepository.preload({
      id: id,
      ...updatePostDto,
    });

    await this.postRepository.save(editPost);
    return { msg: 'Post editado com sucesso!' };
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.postRepository.delete(post);
    return { msg: 'Post deletado com sucesso!' };
  }

  async updateLike(id: number) {
    const post = await this.findOne(id);

    // this.postRepository.increment(post.likes, );
  }
}
