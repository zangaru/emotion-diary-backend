import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.entity';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';

@UseGuards(AuthGuard('jwt')) // 모든 엔드포인트에 대해 JWT 인증 적용
@Controller('diaries')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  /**
   * [POST] 새로운 일기 생성
   * POST /diaries
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) createDiaryDto: CreateDiaryDto, @CurrentUser() user: User) {
    return this.diaryService.create(createDiaryDto, user);
  }

  /**
   * [GET] 특정 사용자의 전체 일기 목록 조회
   * GET /diaries
   */
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.diaryService.findAll(user.id);
  }

  /**
   * [GET] 특정 일기 ID로 조회
   * GET /diaries/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.diaryService.findOne(+id, user.id);
  }

  /**
   * [PATCH] 일기 수정
   * PATCH /diaries/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateDiaryDto: UpdateDiaryDto, @CurrentUser() user: User) {
    return this.diaryService.update(+id, updateDiaryDto, user.id);
  }

  /**
   * [DELETE] 일기 삭제
   * DELETE /diaries/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.diaryService.remove(+id, user.id);
  }
}
