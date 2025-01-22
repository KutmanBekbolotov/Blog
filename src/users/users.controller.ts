import { Controller, Post, Body, Get, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ) {
    return this.usersService.register(username, password, email);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.login(email, password);
  }

  @Post('check-password')
  async checkPassword(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    try {
      const user = await this.usersService.findByEmail(username);
      return { 
        exists: true,
        hasPassword: !!user.password,
        passwordLength: user.password?.length,
      };
    } catch {
      return { exists: false, message: 'User not found' };
    }
  }

  @Get()
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersService.findAll();
    return users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });
  }
}