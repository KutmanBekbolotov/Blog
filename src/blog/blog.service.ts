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
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createBlog(title: string, content: string, author: User, mediaUrl: string | null): Promise<Blog> {
    const blog = new Blog();
    blog.title = title;
    blog.content = content;
    blog.author = author;
    blog.mediaUrl = mediaUrl;
    return this.blogRepository.save(blog);
  }

  async getAllBlogs(): Promise<Blog[]> {
    return this.blogRepository.find({
      relations: ['author'],
      order: {
        date: 'DESC'
      }
    });
  }

  async getBlogById(id: number): Promise<Blog> {
    return this.blogRepository.findOne({ 
      where: { id },
      relations: ['author']
    });
  }

  async updateBlog(id: number, content: string, media?: string): Promise<Blog> {
    const blog = await this.getBlogById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }

    blog.content = content;
    if (media) blog.mediaUrl = media;
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