import { UserRole } from '@autotrader/enums';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Auth } from '../auth/guards/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Auth(UserRole.ADMIN)
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.usersService.createUser(dto);
  }

  // Get users
  @Auth(UserRole.ADMIN)
  @Get()
  async getUsers() {
    return await this.usersService.findAll();
  }

  // Swap access
  @Auth(UserRole.ADMIN)
  @Post('access/:id')
  async swapAccess(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.swapAccess(id);
  }

  // Delete user
  @Auth(UserRole.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.delete(id);
  }

  // Refresh password
  @Auth(UserRole.ADMIN)
  @Post('refresh/:id')
  async refreshPassword(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.refreshPassword(id);
  }
}
