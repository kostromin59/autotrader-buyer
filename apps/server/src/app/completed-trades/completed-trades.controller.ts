import { UserRole } from '@autotrader/enums';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Auth } from '../auth/guards/auth.guard';
import { CurrentUser } from '../users/decorators/user.decorator';
import { CompletedTradesService } from './completed-trades.service';
import { CreateCompletedTradeDto } from './dto/create-completed-trade.dto';

@Controller('completed-trades')
export class CompletedTradesController {
  constructor(
    private readonly completedTradesService: CompletedTradesService
  ) { }

  @Auth()
  @Get()
  async getAll(@CurrentUser('id') userId: number) {
    return await this.completedTradesService.getAllByUserId(userId);
  }

  @Auth()
  @Get(':id')
  async getById(
    @CurrentUser('id') userId: number,
    @CurrentUser('role') role: UserRole,
    @Param('id', ParseIntPipe) id: number
  ) {
    return await this.completedTradesService.getById(
      id,
      role !== UserRole.ADMIN ? userId : undefined
    );
  }

  @Auth(UserRole.ADMIN)
  @Get('user/:userId')
  async getByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.completedTradesService.getListOfUser(userId);
  }

  @Auth()
  @Post()
  async create(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateCompletedTradeDto
  ) {
    return await this.completedTradesService.create(userId, dto);
  }
}
