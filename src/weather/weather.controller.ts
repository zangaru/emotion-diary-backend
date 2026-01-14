import { Controller, Get, Query, ParseFloatPipe } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * [GET] 현재 날씨 조회
   * GET /weather?lat=37.5665&lon=126.9780
   */
  @Get()
  async getCurrentWeather(@Query('lat', ParseFloatPipe) lat: number, @Query('lon', ParseFloatPipe) lon: number) {
    const condition = await this.weatherService.getCurrentWeather(lat, lon);
    return {
      lat,
      lon,
      condition,
    };
  }
}
