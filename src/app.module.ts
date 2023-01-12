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
import { PrismaModule } from './modules/prisma/prisma.module';

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
      entities: [User, Post, Comment, Friendship, Notification],
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
    PrismaModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
