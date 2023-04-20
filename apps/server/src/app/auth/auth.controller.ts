import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CurrentUser } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Auth } from './guards/auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  // Generate tokens by refresh token
  @Post('refresh-token')
  getNewTokens(@Req() req: Request) {
    return this.authService.createTokensByRefresh(req.cookies['refreshToken']);
  }

  // Get profile info
  @Auth()
  @Get('me')
  userProfile(@CurrentUser() user: UserEntity) {
    delete user.dataValues.password;
    return user;
  }
}
