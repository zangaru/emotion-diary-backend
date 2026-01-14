import { IsNotEmpty, Length, IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateDiaryDto {
  @IsNotEmpty({ message: '제목은 필수 항목입니다.' })
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @Length(1, 100, { message: '제목은 1자 이상 100자 이하이어야 합니다.' })
  title!: string;

  @IsNotEmpty({ message: '내용은 필수 항목입니다.' })
  @IsString({ message: '내용은 문자열이어야 합니다.' })
  content!: string;

  @IsNotEmpty({ message: '감정은 필수 항목입니다.' })
  @IsString({ message: '감정은 문자열이어야 합니다.' })
  @Length(1, 20, { message: '감정은 1자 이상 20자 이하이어야 합니다.' })
  emotion!: string;

  @IsNotEmpty({ message: '작성일자는 필수 항목입니다.' })
  @IsDateString({}, { message: '날짜는 유효한 날짜 형식(YYYY-MM-DD)이어야 합니다.' })
  diaryDate!: Date;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lon?: number;

  @IsOptional()
  @IsString()
  weather?: string;
}
