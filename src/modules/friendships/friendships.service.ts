import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { Friendship } from './entities/friendship.entity';

@Injectable()
export class FriendshipsService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async create(createFriendshipDto: CreateFriendshipDto) {
    await this.findOneUserById(createFriendshipDto.followerId);

    if (createFriendshipDto.followerId == createFriendshipDto.userId) {
      throw new BadRequestException();
    }

    const user = new User();
    const friendship = new Friendship();

    user.id = createFriendshipDto.userId;
    friendship.followerId = createFriendshipDto.followerId;
    friendship.user = user;

    return this.friendshipRepository.save(friendship);
  }

  findAll() {
    return this.friendshipRepository.find();
  }

  async findOne(id: number) {
    const friendship = await this.friendshipRepository.findOne({
      where: { id },
    });

    if (!friendship) {
      throw new NotFoundException();
    }

    return friendship;
  }

  async remove(id: number) {
    const friendship = await this.findOne(id);
    return this.friendshipRepository.remove(friendship);
  }
}
