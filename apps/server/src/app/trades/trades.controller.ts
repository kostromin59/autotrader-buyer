import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from '../auth/guards/auth.guard';
import { CurrentUser } from '../users/decorators/user.decorator';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { TradesService } from './trades.service';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  // Create offer
  @Auth()
  @Post()
  async createOffer(
    @Body() dto: CreateOfferDto,
    @CurrentUser('id') userId: number
  ) {
    return await this.tradesService.create(userId, dto);
  }

  // Get user offers
  @Auth()
  @Get()
  async getOffers(@CurrentUser('id') userId: number) {
    return await this.tradesService.findAllUserOffers(userId);
  }

  // Update offer
  @Auth()
  @Patch(':id')
  async updateOffer(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateOfferDto
  ) {
    return await this.tradesService.update(userId, id, dto);
  }

  // Enable or disable offer
  @Auth()
  @Post(':id')
  async enableOrDisableOffer(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number
  ) {
    return await this.tradesService.enableOrDisableOffer(id, userId);
  }

  // Delete offer
  @Auth()
  @Delete(':id')
  async deleteOffer(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number
  ) {
    return await this.tradesService.delete(id, userId);
  }
}
