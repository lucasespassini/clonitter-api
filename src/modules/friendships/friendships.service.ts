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

  async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async create(createFriendshipDto: CreateFriendshipDto) {
    const newFriend = this.friendshipRepository.create(createFriendshipDto);

    await this.findUserById(newFriend.followingId);

    if (newFriend.followingId == newFriend.user) {
      throw new BadRequestException();
    }

    const frindship = await this.friendshipRepository.save(newFriend);
    return this.findOne(frindship.id);
  }

  async findOne(id: number) {
    const friendship = await this.friendshipRepository.findOne({
      where: { id },
      relations: { user: true },
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
