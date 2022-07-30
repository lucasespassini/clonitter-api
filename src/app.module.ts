import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { User } from './modules/users/entities/user.entity';
import { Post } from './modules/posts/entities/post.entity';
import { Comment } from './modules/comments/entities/comment.entity';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersController } from './modules/users/users.controller';
import { PostsController } from './modules/posts/posts.controller';
import { CommentsController } from './modules/comments/comments.controller';
import { ConfigModule } from '@nestjs/config';
import { FriendshipsModule } from './modules/friendships/friendships.module';
import { Friendship } from './modules/friendships/entities/friendship.entity';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    CommentsModule,
    FriendshipsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Post, Comment, Friendship],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        {
          path: 'user/login',
          method: RequestMethod.POST,
        },
        {
          path: 'user',
          method: RequestMethod.POST,
        },
      )
      .forRoutes(
        AppController,
        UsersController,
        PostsController,
        CommentsController,
      );
  }
}
