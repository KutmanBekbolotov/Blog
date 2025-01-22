import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './blog.entity';
import { User } from '../users/user.entity';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async createBlog(
    @Body('content') content: string,
    @Body('authorId') authorId: number, 
    @Body('media') media?: string,
  ): Promise<Blog> {
    const author = await this.blogService.getUserById(authorId);
    if (!author) {
      throw new Error('Author not found');
    }
    return this.blogService.createBlog(content, author, media);
  }

  @Get()
  async getAllBlogs(): Promise<Blog[]> {
    return this.blogService.getAllBlogs();
  }

  @Get(':id')
  async getBlogById(@Param('id') id: number): Promise<Blog> {
    return this.blogService.getBlogById(id);
  }

  @Put(':id')
  async updateBlog(
    @Param('id') id: number,
    @Body('content') content: string,
    @Body('media') media?: string,
  ): Promise<Blog> {
    return this.blogService.updateBlog(id, content, media);
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: number): Promise<void> {
    return this.blogService.deleteBlog(id);
  }
}