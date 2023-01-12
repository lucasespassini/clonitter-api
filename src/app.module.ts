import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { FriendshipsModule } from './modules/friendships/friendships.module';
import { User } from './modules/users/entities/user.entity';
import { Post } from './modules/posts/entities/post.entity';
import { Comment } from './modules/comments/entities/comment.entity';
import { Friendship } from './modules/friendships/entities/friendship.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerMiddleware } from './middlewares/log.middleware';

import { AuthModule } from './modules/auth/auth.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { Notification } from './modules/notifications/entities/notification.entity';
import { PostLikesModule } from './modules/likes/post_likes/post_likes.module';
import { PostLike } from './modules/likes/post_likes/entities/post_like.entity';
import { CommentLikesModule } from './modules/likes/comment_likes/comment_likes.module';
import { CommentLike } from './modules/likes/comment_likes/entities/comment_like.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Post,
        Comment,
        Friendship,
        Notification,
        PostLike,
        CommentLike,
      ],
      synchronize: false,
      logging: false,
    }),
    MulterModule.register({
      dest: 'public',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/uploads/',
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    FriendshipsModule,
    AuthModule,
    NotificationsModule,
    PostLikesModule,
    CommentLikesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
