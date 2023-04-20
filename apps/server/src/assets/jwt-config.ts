import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

// JWT config for module
export const jwtConfig = async (
  configService: ConfigService
): Promise<JwtModuleOptions> => ({
  secret: configService.get('JWT_SECRET'),
});
