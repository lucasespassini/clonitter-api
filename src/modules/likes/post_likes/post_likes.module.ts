import { Module } from '@nestjs/common';
import { LikesService } from './post_likes.service';
import { LikesController } from './post_likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from './entities/post_like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class PostLikesModule {}
