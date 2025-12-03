import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from './diary.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { User } from 'src/user/user.entity';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
  ) {}

  /**
   * 새 일기 생성
   *
   * @param createDiaryDto
   * @param user
   * @returns
   */
  async create(createDiaryDto: CreateDiaryDto, user: User): Promise<Diary> {
    const diary = this.diaryRepository.create({
      ...createDiaryDto,
      userId: user.id,
    });
    return this.diaryRepository.save(diary);
  }

  /**
   * 특정 사용자의 모든 일기 조회
   *
   * @param userId
   * @returns
   */
  async findAll(userId: number): Promise<Diary[]> {
    return this.diaryRepository.find({
      where: { userId },
      order: { diaryDate: 'DESC' },
    });
  }

  /**
   * 특정 일기 하나 조회
   *
   * @param id
   * @param userId
   * @returns
   */
  async findOne(id: number, userId: number): Promise<Diary> {
    const diary = await this.diaryRepository.findOne({ where: { id, userId } });

    if (!diary) {
      throw new NotFoundException(`ID가 ${id}인 일기를 찾을 수 없거나 접근 권한이 없습니다.`);
    }
    return diary;
  }

  /**
   * 일기 수정
   *
   * @param id
   * @param updateDiaryDto
   * @param userId
   * @returns
   */
  async update(id: number, updateDiaryDto: UpdateDiaryDto, userId: number): Promise<Diary> {
    const diary = await this.findOne(id, userId);

    this.diaryRepository.merge(diary, updateDiaryDto);

    return this.diaryRepository.save(diary);
  }

  /**
   * 일기 삭제
   *
   * @param id
   * @param userId
   */
  async remove(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);

    await this.diaryRepository.delete(id);
  }
}
