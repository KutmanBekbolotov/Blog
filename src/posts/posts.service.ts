import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(content: string, mediaUrl: string, author: User): Promise<Post> {
    const newPost = this.postRepository.create({ content, mediaUrl, author });
    return this.postRepository.save(newPost);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['author'] });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }

  async update(
    id: number,
    content: string,
    mediaUrl: string,
    author: User, 
  ): Promise<Post> {
    const post = await this.findOne(id);

    if (post.author.id !== author.id) {
      throw new Error('You can only edit your own posts');
    }

    post.content = content;
    post.mediaUrl = mediaUrl;
    return this.postRepository.save(post);
  }

  async remove(id: number, author: User): Promise<void> {
    const post = await this.findOne(id);

    if (post.author.id !== author.id) {
      throw new Error('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
  }
}
