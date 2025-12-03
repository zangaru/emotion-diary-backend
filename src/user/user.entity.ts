import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Diary } from '../diary/diary.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // 자동 증가 ID

  @Column({ unique: true })
  email!: string; // 고유한 로그인 ID

  @Column()
  password!: string; // 해시된 비밀번호

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries!: Diary[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date; // 생성일시
}
