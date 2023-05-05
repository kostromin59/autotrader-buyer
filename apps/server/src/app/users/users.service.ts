import { UserRole } from '@autotrader/enums';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { hash } from 'bcrypt';
import { generate } from 'generate-password';
import { TelegramService } from '../telegram/telegram.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity) private readonly userEntity: typeof UserEntity,
    private readonly telegramService: TelegramService,
    private readonly configService: ConfigService
  ) {
    // Test account
    // this.userEntity
    //   .findOne({
    //     where: {
    //       email: 'weker1230@gmail.com',
    //     },
    //   })
    //   .then((user) => {
    //     if (!user) {
    //       this.createUser({
    //         email: configService.get('ADMIN_EMAIL'),
    //         key: configService.get('ADMIN_KEY'),
    //         telegram: configService.get('ADMIN_TELEGRAM'),
    //       }).then((user) =>
    //         user.update({
    //           role: UserRole.ADMIN,
    //         })
    //       );
    //     }
    //   });
  }

  // Create user
  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const oldUser = await this.findByEmail(dto.email);

    // Does user exist with this email
    if (oldUser) throw new BadRequestException('User is already exists!');

    // User password
    const password = this.generatePassword();

    // Hash
    const hashedPassword = await hash(password, 10);

    // Creating user
    const newUser = await this.userEntity.create({
      email: dto.email,
      key: dto.key,
      telegram: dto.telegram,
      password: hashedPassword,
    });

    // Sending password to telegram
    await this.telegramService.sendMessage(
      dto.telegram,
      `Your password: ${password}`
    );

    return newUser;
  }

  // Find user by id
  async findById(id: number): Promise<UserEntity> {
    return await this.userEntity.findOne({
      where: {
        id,
      },
    });
  }

  // Find user by email
  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userEntity.findOne({
      where: { email },
    });
  }

  // Find all users
  async findAll(): Promise<UserEntity[]> {
    return await this.userEntity.findAll({
      attributes: {
        exclude: ['password'],
      },
    });
  }

  // Change access
  async swapAccess(id: number): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found!');

    await user.update({
      hasAccess: !user.hasAccess,
    });

    return user;
  }

  // Delete user
  async delete(id: number): Promise<number> {
    return await this.userEntity.destroy({
      where: {
        id,
      },
    });
  }

  async refreshPassword(userId: number): Promise<number> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found!');

    // New user password
    const password = this.generatePassword();

    // New hash
    const hashedPassword = await hash(password, 10);

    // Send to telegram
    await this.telegramService.sendMessage(
      user.telegram,
      `Your new password: ${password}`
    );

    // Update password
    await user.update({
      password: hashedPassword,
    });

    return userId;
  }

  // Generate password
  private generatePassword(): string {
    return generate({
      length: Math.floor(Math.random() * (32 - 16 + 1)) + 16,
      numbers: true,
    });
  }
}
