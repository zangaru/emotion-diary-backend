import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from './diary.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { User } from 'src/user/user.entity';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { StatsResponse, EmotionCount, MonthlyTrend } from './dto/stats.dto';

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
      where: { userId, deleteYn: false },
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
    const diary = await this.diaryRepository.findOne({ where: { id, userId, deleteYn: false } });

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
    const diary = await this.findOne(id, userId);

    // 논리적 삭제
    diary.deleteYn = true;

    await this.diaryRepository.save(diary);
  }

  /**
   * 특정 키워드로 일기 검색
   *
   * @param userId
   * @param keyword
   * @returns
   */
  async search(userId: number, keyword: string): Promise<Diary[]> {
    return this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.userId = :userId', { userId })
      .andWhere('diary.deleteYn = false')
      .andWhere('(diary.title LIKE :keyword OR diary.content LIKE :keyword)', {
        keyword: `%${keyword}%`,
      })
      .orderBy('diary.diaryDate', 'DESC')
      .getMany();
  }

  /**
   * 감정별 필터링
   *
   * @param userId
   * @param emotion
   * @returns
   */
  async findByEmotion(userId: number, emotion: string): Promise<Diary[]> {
    return this.diaryRepository.find({
      where: { userId, emotion, deleteYn: false },
      order: { diaryDate: 'DESC' },
    });
  }

  /**
   * 특정 날짜의 일기 조회
   *
   * @param userId
   * @param diaryDate
   * @returns
   */
  async findByDate(userId: number, diaryDate: Date): Promise<Diary[]> {
    return this.diaryRepository.find({
      where: { userId, diaryDate, deleteYn: false },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 감정 통계 조회
   *
   * @param userId
   * @returns
   */
  async getStats(userId: number): Promise<StatsResponse> {
    const diaries = await this.diaryRepository.find({
      where: { userId, deleteYn: false },
      order: { diaryDate: 'ASC' },
    });

    const totalDiaries = diaries.length;

    const emotionCountMap = new Map<string, number>();
    diaries.forEach((diary) => {
      emotionCountMap.set(diary.emotion, (emotionCountMap.get(diary.emotion) || 0) + 1);
    });

    const emotionCounts: EmotionCount[] = Array.from(emotionCountMap.entries()).map(([emotion, count]) => ({
      emotion,
      count,
    }));

    const mostFrequentEmotion =
      emotionCounts.length > 0
        ? emotionCounts.reduce((max, current) => (current.count > max.count ? current : max)).emotion
        : null;

    const monthlyTrendMap = new Map<string, Map<string, number>>();

    diaries.forEach((diary) => {
      const date = new Date(diary.diaryDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyTrendMap.has(monthKey)) {
        monthlyTrendMap.set(monthKey, new Map());
      }

      const monthEmotionMap = monthlyTrendMap.get(monthKey)!;
      monthEmotionMap.set(diary.emotion, (monthEmotionMap.get(diary.emotion) || 0) + 1);
    });

    const monthlyTrend: MonthlyTrend[] = Array.from(monthlyTrendMap.entries()).map(([month, emotionMap]) => ({
      month,
      emotions: Array.from(emotionMap.entries()).map(([emotion, count]) => ({ emotion, count })),
    }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonthCount = diaries.filter((diary) => {
      const diaryDate = new Date(diary.diaryDate);
      return diaryDate.getMonth() === today.getMonth() && diaryDate.getFullYear() === today.getFullYear();
    }).length;

    let currentStreak = 0;
    const sortedDates = diaries
      .map((diary) => {
        const date = new Date(diary.diaryDate);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
      .sort((a, b) => b - a);

    if (sortedDates.length > 0) {
      const checkDate = new Date(today);
      checkDate.setHours(0, 0, 0, 0);
      const todayTimestamp = checkDate.getTime();
      const yesterdayTimestamp = todayTimestamp - 24 * 60 * 60 * 1000;

      if (sortedDates[0] === todayTimestamp) {
        currentStreak = 1;
      } else if (sortedDates[0] === yesterdayTimestamp) {
        currentStreak = 1;
      } else {
        return {
          totalDiaries,
          currentStreak: 0,
          thisMonthCount,
          emotionCounts,
          monthlyTrend,
          mostFrequentEmotion,
        };
      }

      for (let i = 1; i < sortedDates.length; i++) {
        const currentTimestamp = sortedDates[i];
        const previousTimestamp = sortedDates[i - 1];

        if (previousTimestamp - currentTimestamp === 24 * 60 * 60 * 1000) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return {
      totalDiaries,
      currentStreak,
      thisMonthCount,
      emotionCounts,
      monthlyTrend,
      mostFrequentEmotion,
    };
  }
}
