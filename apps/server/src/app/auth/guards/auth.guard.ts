import { UserRole } from '@autotrader/enums';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { RoleGuard } from './role.guard';

// Auth and role guard
export const Auth = (role?: UserRole) =>
  role ? UseGuards(JwtAuthGuard, new RoleGuard(role)) : UseGuards(JwtAuthGuard);
