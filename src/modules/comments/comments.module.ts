import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Post } from '../posts/entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Notification } from '../notifications/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, Notification])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
