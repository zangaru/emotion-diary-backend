import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('user') 
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // 자동 증가 ID

  @Column({ unique: true })
  email!: string; // 고유한 로그인 ID

  @Column()
  password!: string; // 해시된 비밀번호

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date; // 생성일시
}