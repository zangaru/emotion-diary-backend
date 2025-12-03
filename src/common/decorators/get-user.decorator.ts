import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/user.entity';

/**
 * 요청 객체(req)에서 인증된 사용자(req.user) 정보를 추출하여 User 타입으로 반환하는 데코레이터
 * @returns User 객체
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest<{ user: User }>();
  return request.user;
});
