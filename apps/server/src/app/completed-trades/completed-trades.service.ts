import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCompletedTradeDto } from './dto/create-completed-trade.dto';
import { CompletedTradeEntity } from './entites/completed-trade.entity';

@Injectable()
export class CompletedTradesService {
  constructor(
    @InjectModel(CompletedTradeEntity)
    private readonly completedTradeEntity: typeof CompletedTradeEntity
  ) { }

  async create(userId: number, dto: CreateCompletedTradeDto) {
    return await this.completedTradeEntity.create({
      ...dto,
      userId,
    });
  }

  async getById(id: number, userId?: number): Promise<CompletedTradeEntity> {
    return await this.completedTradeEntity.findOne({
      where: userId
        ? {
          id,
          userId,
        }
        : {
          id,
        },
    });
  }

  async getAllByUserId(userId: number): Promise<CompletedTradeEntity[]> {
    return await this.completedTradeEntity.findAll({
      where: {
        userId,
      },
    });
  }

  async getListOfUser(
    userId: number
  ): Promise<Pick<CompletedTradeEntity, 'id' | 'createdAt'>[]> {
    return await this.completedTradeEntity.findAll({
      where: {
        userId,
      },
      attributes: ['id', 'createdAt'],
    });
  }
}
