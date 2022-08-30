import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const newPost = this.postRepository.create(createPostDto);
      return this.postRepository.save(newPost);
    } catch (error) {
      throw new BadRequestException({ error: error['sqlMessage'] });
    }
  }

  async findAll() {
    const posts = await this.postRepository.find({
      order: { id: 'DESC', createdAt: 'DESC' },
      relations: ['comments', 'user'],
    });

    return posts;
  }

  async findOneByUUID(uuid: string) {
    const post = await this.postRepository
      .createQueryBuilder('posts')
      .where('posts.uuid = :uuid', { uuid })
      .innerJoin('posts.user', 'post_user')
      .leftJoin('posts.comments', 'comments')
      .leftJoin('comments.user', 'comment_user')
      .select([
        'posts.id',
        'posts.uuid',
        'posts.content',
        'posts.likes',
        'posts.createdAt',
        'post_user.id',
        'post_user.profile_image',
        'post_user.user_name',
        'post_user.name',
        'comments.id',
        'comments.content',
        'comments.likes',
        'comments.createdAt',
        'comment_user.id',
        'comment_user.profile_image',
        'comment_user.user_name',
        'comment_user.name',
      ])
      .getOne();

    if (!post) throw new NotFoundException('Post não encontrado!');

    return post;
  }

  async findAllPostsByUserId(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`Usuário ${id} não existe!`);

    const posts = await this.postRepository
      .createQueryBuilder('posts')
      .innerJoinAndSelect('posts.user', 'user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('posts.comments', 'comments')
      .orderBy('posts.id', 'DESC')
      .getMany();

    return posts;
  }

  async findAllFriendPosts(id: number) {
    const posts = await this.postRepository
      .createQueryBuilder('posts')
      .innerJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('user.friendships', 'friendships')
      .where('user.id = :id', { id })
      .orWhere('user.id = friendships.followerId')
      // .andWhere('user.id = friendships.followerId')
      .getMany();

    return posts;
  }

  // async findAllFriendPosts(id: number) {
  //   const posts = [];

  //   const user = await this.userRepository.findOne({
  //     where: { id },
  //     relations: {
  //       friendships: true,
  //     },
  //   });

  //   if (!user) throw new NotFoundException('Usuário não encontrado!');

  //   for (const friendship of user.friendships) {
  //     const friendPosts = await this.postRepository
  //       .createQueryBuilder('posts')
  //       .innerJoinAndSelect('posts.user', 'user')
  //       .where('user.id = :followerId', {
  //         followerId: friendship.followerId,
  //       })
  //       .leftJoinAndSelect('posts.comments', 'comments')
  //       .getMany();

  //     friendPosts.forEach((post) => posts.push(post));
  //   }

  //   const userPosts = await this.postRepository
  //     .createQueryBuilder('posts')
  //     .innerJoinAndSelect('posts.user', 'user')
  //     .where('user.id = :id', { id })
  //     .leftJoinAndSelect('user.friendships', 'friendships')
  //     .leftJoinAndSelect('posts.comments', 'comments')
  //     .getMany();

  //   userPosts.forEach((userPost) => posts.push(userPost));

  //   return posts.sort((a, b) => {
  //     if (a.id < b.id) {
  //       return 1;
  //     }
  //     if (a.id > b.id) {
  //       return -1;
  //     }
  //     return 0;
  //   });
  // }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
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

  async addLike(uuid: string) {
    const post = await this.postRepository.findOneBy({ uuid });

    if (!post) throw new NotFoundException('Post não encontrado!');

    post.likes += 1;
    return this.postRepository.save(post);
  }

  async removeLike(uuid: string) {
    const post = await this.postRepository.findOneBy({ uuid });

    if (!post) throw new NotFoundException('Post não encontrado!');

    if (post.likes == 0) return post;

    post.likes -= 1;
    return this.postRepository.save(post);
  }
}
