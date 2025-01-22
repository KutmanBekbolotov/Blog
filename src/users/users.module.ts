import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Регистрируем репозиторий User
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],  // Экспортируем UsersService и TypeOrmModule
})
export class UsersModule {}