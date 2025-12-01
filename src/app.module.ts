import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM 모듈 추가
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 환경 변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM 데이터베이스 연결 설정 (PostgreSQL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: (config: ConfigService) => ({
        type: config.get<any>('DATABASE_TYPE'), 
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        
        // 엔티티 자동 로드
        autoLoadEntities: true, 
        
        // 개발 단계에서 테이블 자동 생성/수정 (배포 시에는 false 처리하기)
        synchronize: true, 
      }),
    }),
    
    // User 모듈 등록
    UserModule,
    
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}