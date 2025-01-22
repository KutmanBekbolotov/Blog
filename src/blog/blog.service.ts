import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { User } from '../users/user.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(User)  // Внедряем репозиторий User
    private userRepository: Repository<User>,
  ) {}

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createBlog(content: string, author: User, media?: string): Promise<Blog> {
    const newBlog = this.blogRepository.create({
      content,
      author,
      media,
    });
    return this.blogRepository.save(newBlog);
  }

  async getAllBlogs(): Promise<Blog[]> {
    return this.blogRepository.find();
  }

  async getBlogById(id: number): Promise<Blog> {
    return this.blogRepository.findOne({ where: { id } });
  }

  async updateBlog(id: number, content: string, media?: string): Promise<Blog> {
    const blog = await this.getBlogById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }

    blog.content = content;
    if (media) blog.media = media;
    return this.blogRepository.save(blog);
  }

  async deleteBlog(id: number): Promise<void> {
    const blog = await this.getBlogById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }
    await this.blogRepository.remove(blog);
  }
}