import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    is_day: number;
    time: string;
  };
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly URL = 'https://api.open-meteo.com/v1/forecast';

  constructor(private readonly httpService: HttpService) {}

  async getCurrentWeather(lat: number, lon: number): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<OpenMeteoResponse>(this.URL, {
          params: {
            latitude: lat,
            longitude: lon,
            current_weather: true,
            timezone: 'auto',
          },
        }),
      );

      const weatherCode = response.data.current_weather.weathercode;
      return this.interpretWeatherCode(weatherCode);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`날씨 정보를 가져오는데 실패했습니다: ${errorMessage}`);
      return 'Unknown';
    }
  }

  // 날씨 코드를 해석하여 문자열로 반환하는 메서드
  private interpretWeatherCode(code: number): string {
    if (code === 0) return 'Clear sky';
    if ([1, 2, 3].includes(code)) return 'Partly cloudy';
    if ([45, 48].includes(code)) return 'Fog';
    if ([51, 53, 55].includes(code)) return 'Drizzle';
    if ([61, 63, 65].includes(code)) return 'Rain';
    if ([71, 73, 75].includes(code)) return 'Snow';
    if ([95, 96, 99].includes(code)) return 'Thunderstorm';
    return 'Cloudy';
  }
}
