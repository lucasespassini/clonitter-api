import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';

@Injectable()
export class FriendshipsService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByUserName(usr_user_name: string) {
    return this.prisma.users.findUnique({
      where: { usr_user_name },
    });
  }

  async create(createFriendshipDto: CreateFriendshipDto) {
    const results = await Promise.all([
      this.findUserByUserName(createFriendshipDto.follower_user_name),
      this.findUserByUserName(createFriendshipDto.following_user_name),
    ]);

    const followerUser = results[0];
    const followingUser = results[1];

    const friendship = await this.prisma.friendships.create({
      data: {
        frd_usr_follower_id: followerUser.usr_id,
        frd_usr_following_id: followingUser.usr_id,
      },
    });

    return friendship;
  }

  async remove(createFriendshipDto: CreateFriendshipDto) {
    const results = await Promise.all([
      this.findUserByUserName(createFriendshipDto.follower_user_name),
      this.findUserByUserName(createFriendshipDto.following_user_name),
    ]);

    const followerUser = results[0];
    const followingUser = results[1];

    const friendship = await this.prisma.friendships.findFirst({
      where: {
        AND: [
          { frd_usr_follower_id: followerUser.usr_id },
          { frd_usr_following_id: followingUser.usr_id },
        ],
      },
    });

    if (!friendship) {
      return { message: 'amizade não encontrada' };
    }

    return this.prisma.friendships.delete({
      where: {
        frd_id: friendship.frd_id,
      },
    });
  }
}
