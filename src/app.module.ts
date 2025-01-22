import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';
import { Blog } from './blog/blog.entity';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'blogdb',
      entities: [User, Blog],  
      synchronize: true,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }),
    AuthModule,
    BlogModule,
    UsersModule,
  ],
})
export class AppModule {}