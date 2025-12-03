import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService, // JWT_SECRET을 가져오기 위해 주입
    private readonly userService: UserService, // 토큰에서 추출한 ID로 사용자 조회
  ) {
    super({
      // 1. JWT를 요청의 Authorization 헤더에서 추출 (Bearer 토큰 방식)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. 토큰 서명 시 사용한 비밀 키(.env에 설정)
      // Non-null Assertion Operator (!) 추가하여 string 임을 명시
      secretOrKey: configService.get<string>('JWT_SECRET')!,

      // 3. 토큰 만료를 Passport가 자동으로 처리
      ignoreExpiration: false,
    });
  }

  /**
   * 토큰 유효성 검증 및 사용자 정보 반환
   */
  async validate(payload: { email: string; sub: number }): Promise<User> {
    const { sub: userId } = payload;

    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');
    }

    return user;
  }
}
