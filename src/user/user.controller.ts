import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
    return {
      message: 'User registered successfully',
      user: { email: createUserDto.email },
    };
  }

  @UseGuards(AuthGuard('jwt')) // JWT 토큰이 유효한지 검증
  @Get('/profile')
  getProfile(@Req() req) {
    return {
      message: '인증되었습니다. 사용자 프로필 정보입니다.',
      user: {
        id: req.user.id,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    };
  }
}
