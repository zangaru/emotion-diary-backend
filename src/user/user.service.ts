import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; 
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * 새로운 사용자를 생성한다.
   * 
   * @param createUserDto 
   * @returns 
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // 이미 존재하는 이메일인지 확인
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.'); 
    }

    // 비밀번호 해싱 
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 사용자 생성 및 저장
    const newUser = this.usersRepository.create({ 
        email, 
        password: hashedPassword 
    });

    return this.usersRepository.save(newUser);
  }

  /**
   * 이메일로 사용자를 조회한다.
   * 
   * @param email 
   * @returns 
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: {email} });
  }

  /**
   * ID로 사용자를 조회한다.
   * 
   * @param id 
   * @returns 
   */
  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: {id} });
  }
}