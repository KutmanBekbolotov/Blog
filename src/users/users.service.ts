import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(username: string, password: string, email: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ 
      where: [{ email }, { username }] 
    });
    
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async login(email: string, password: string) {
    console.log('Login attempt:', { email });
    
    const user = await this.usersRepository.findOne({ 
      where: { email }
    });

    if (!user) {
      console.log('User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('Found user:', { 
      id: user.id, 
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password?.length 
    });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async updateNullUsernames() {
    const users = await this.usersRepository.find({
      where: {
        username: null
      }
    });

    for (const user of users) {
      user.username = user.email;
      await this.usersRepository.save(user);
    }
  }

  async findOne(options: any): Promise<User> {
    return this.usersRepository.findOne(options);
  }
}