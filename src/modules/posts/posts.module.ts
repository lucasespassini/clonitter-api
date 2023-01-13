import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, UsersService, PrismaService],
})
export class PostsModule {}
