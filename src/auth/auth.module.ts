import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ConfigModule, ConfigService 추가
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module'; // UserModule import

@Module({
  imports: [
    UserModule, // User 정보를 가져온다.

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // .env에서 비밀 키 가져오기
        signOptions: {
          expiresIn: '1h', // 토큰 만료 시간: 1시간
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [
    AuthService,
    PassportModule, 
    JwtModule, // 다른 모듈에서 사용될 수 있도록 export
  ],
})
export class AuthModule {}