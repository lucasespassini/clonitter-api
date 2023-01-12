import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Friendship } from '../friendships/entities/friendship.entity';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friendship])],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
