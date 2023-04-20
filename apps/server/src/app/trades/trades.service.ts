import { ITradeItem } from '@autotrader/interfaces';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { TradeItem } from './entities/trade-item.entity';
import { TradeOffer } from './entities/trade-offer.entity';

@Injectable()
export class TradesService {
  constructor(
    @InjectModel(TradeOffer) private readonly offerModel: typeof TradeOffer
  ) { }

  // Create offer
  async create(userId: number, dto: CreateOfferDto): Promise<TradeOffer> {
    const has = Object.fromEntries(
      Object.entries(dto.has).filter(([_, v]) => v != null)
    ) as ITradeItem;

    const wants = Object.fromEntries(
      Object.entries(dto.wants).filter(([_, v]) => v != null)
    ) as ITradeItem;

    const offer = await this.offerModel.create(
      {
        userId,
        has,
        wants,
        garageItem: dto.garageItem,
        garageTrade: dto.garageTrade,
      },
      // Including has and wants items
      {
        include: [
          {
            model: TradeItem,
            as: 'has',
          },
          {
            model: TradeItem,
            as: 'wants',
          },
        ],
      }
    );

    return offer;
  }

  // Find all user offers
  async findAllUserOffers(userId: number): Promise<TradeOffer[]> {
    return await this.offerModel.findAll({
      include: [
        // Include has item
        {
          model: TradeItem,
          as: 'has',
          attributes: {
            exclude: ['hasId', 'wantsId'],
          },
        },
        // Include wants item
        {
          model: TradeItem,
          as: 'wants',
          attributes: {
            exclude: ['hasId', 'wantsId'],
          },
        },
        // Include user
        {
          model: UserEntity,
          where: {
            id: userId,
          },
          attributes: [],
        },
      ],
    });
  }

  // Find one offer by id
  async findOneOfferById(id: number): Promise<TradeOffer> {
    const offer = await this.offerModel.findOne({
      where: {
        id,
      },
      include: [
        // Include has item
        {
          model: TradeItem,
          as: 'has',
          attributes: {
            exclude: ['hasId', 'wantsId'],
          },
        },
        // Include wants item
        {
          model: TradeItem,
          as: 'wants',
          attributes: {
            exclude: ['hasId', 'wantsId'],
          },
        },
      ],
    });

    if (!offer) throw new NotFoundException('Offer not found!');
    return offer;
  }

  // Enable or disable offer
  async enableOrDisableOffer(id: number, userId: number): Promise<TradeOffer> {
    const offer = await this.findOneOfferById(id);

    this.checkIsOwner(userId, offer.userId);

    await offer.update({
      isEnabled: !offer.isEnabled,
    });

    return offer;
  }

  // Update items
  async update(
    userId: number,
    offerId: number,
    dto: UpdateOfferDto
  ): Promise<TradeOffer> {
    const offer = await this.findOneOfferById(offerId);

    this.checkIsOwner(userId, offer.userId);

    await offer.has.update({
      id: dto.has.id,
      amount: dto.has.amount || 1,
      blueprint: dto.has.blueprint,
      cert: Number(dto.has.cert),
      item: dto.has.item,
      paint: Number(dto.has.paint),
      quality: Number(dto.has.quality),
      series: Number(dto.has.series),
      special: Number(dto.has.special),
    });

    await offer.wants.update({
      id: dto.wants.id,
      amount: dto.wants.amount || 1,
      blueprint: dto.wants.blueprint,
      cert: Number(dto.wants.cert),
      item: dto.wants.item,
      paint: Number(dto.wants.paint),
      quality: Number(dto.wants.quality),
      series: Number(dto.wants.series),
      special: Number(dto.wants.special),
    });

    await offer.update({
      garageTrade: dto.garageTrade,
      garageItem: dto.garageItem,
    });

    return offer;
  }

  // Delete offer
  async delete(id: number, userId: number): Promise<number> {
    const offer = await this.findOneOfferById(id);

    this.checkIsOwner(userId, offer.userId);

    await this.offerModel.destroy({
      where: {
        id,
      },
    });

    return offer.id;
  }

  // Check is user owner of offer
  private checkIsOwner(userId: number, ownerId: number): boolean {
    if (userId !== ownerId) throw new BadRequestException('You is not owner!');
    return true;
  }
}
