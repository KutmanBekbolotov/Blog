import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Blog } from './blog.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, User]),
    UsersModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}