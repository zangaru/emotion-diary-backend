import { Controller, Post, Body, ValidationPipe, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Controller('users') 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @HttpCode(201) 
  async register(
    @Body(ValidationPipe) createUserDto: CreateUserDto, 
  ): Promise<{ message: string, user: User }> {
    const user = await this.userService.create(createUserDto);
    
    // 비밀번호 정보는 응답에서 제외하고 전달 (보안)
    const { password, ...result } = user; 

    return { 
        message: '회원가입이 성공적으로 완료되었습니다.',
        user: result as User 
    };
  }
}