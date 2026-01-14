import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  imports: [TypeOrmModule.forFeature([Diary]), WeatherModule],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
