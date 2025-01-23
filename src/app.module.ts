import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        if (
          !process.env.DB_HOST ||
          !process.env.DB_PORT ||
          !process.env.DB_USER ||
          !process.env.DB_PASSWORD ||
          !process.env.DB_NAME
        ) {
          throw new Error('One or more required database environment variables are missing!');
        }

        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [__dirname + '/**/*.entity{.ts,.js}'], 
          synchronize: process.env.NODE_ENV !== 'production',
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    AuthModule,
    BlogModule,
    UsersModule,
  ],
})
export class AppModule {}