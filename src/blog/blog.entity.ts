import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('text')
  content: string;

  @ManyToOne(() => User, user => user.blog)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ nullable: true })
  media: string;  // URL или путь к медиа файлу
}