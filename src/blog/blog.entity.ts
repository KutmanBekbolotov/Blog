import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  mediaUrl: string;

  @ManyToOne(() => User, (user) => user.blog)
  author: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}