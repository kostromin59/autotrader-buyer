import { ITokens } from '@autotrader/interfaces';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService
  ) { }

  // Login user
  async login(dto: AuthDto): Promise<ITokens> {
    // Check email and password
    const user = await this.validateUser(dto);

    const tokens = this.createTokens(user.id);
    return tokens;
  }

  // Create tokens by refresh token
  async createTokensByRefresh(refreshToken: string): Promise<ITokens> {
    try {
      const result = await this.jwt.verifyAsync(refreshToken);
      if (!result) throw new UnauthorizedException('Invalid refresh token');

      const user = await this.usersService.findById(result.userId);
      if (!user) throw new NotFoundException('User not found');

      const tokens = this.createTokens(user.id);

      return tokens;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Create tokens
  private createTokens(id: number): ITokens {
    // JWT payload
    const data = {
      userId: id,
    };

    // Access token
    const accessToken = this.jwt.sign(data, {
      expiresIn: '15m',
    });

    // Refresh token
    const refreshToken = this.jwt.sign(data, {
      expiresIn: '2d',
    });

    return { accessToken, refreshToken };
  }

  // Validate email and password
  private async validateUser(dto: AuthDto): Promise<UserEntity> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordsMatch = await compare(dto.password, user.password);
    if (!isPasswordsMatch)
      throw new UnauthorizedException('Invalid email or password');

    return user;
  }
}
