import { Controller, Post, Body, Get, Param, Delete, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { Blog } from './blog.entity';
import { User } from '../users/user.entity';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(FileInterceptor('media', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async createBlog(
    @Body('content') content: string,
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @UploadedFile() media?: Express.Multer.File,  
  ): Promise<Blog> {
    const author = await this.blogService.getUserById(authorId);
    if (!author) {
      throw new Error('Author not found');
    }

    const mediaUrl = media ? `/uploads/${media.filename}` : null;
    return this.blogService.createBlog(title, content, author, mediaUrl);  
  }

  @Get()
  async getAllBlogs(): Promise<Blog[]> {
    const blogs = await this.blogService.getAllBlogs();
    return blogs;
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