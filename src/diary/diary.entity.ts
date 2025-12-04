import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  // 감정
  @Column({ length: 20, nullable: false })
  emotion!: string;

  // 일기가 작성된 날짜 (사용자가 선택한 날짜)
  @Column({ type: 'date', nullable: false })
  diaryDate!: Date;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.diaries, { eager: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
