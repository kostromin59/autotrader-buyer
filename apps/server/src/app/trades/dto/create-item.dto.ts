import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateItemDto {
  @IsNumber()
  item: number;

  @IsOptional()
  @IsBoolean()
  blueprint?: boolean;

  @IsOptional()
  @IsNumber()
  paint?: number;

  @IsOptional()
  @IsNumber()
  quality?: number;

  @IsOptional()
  @IsNumber()
  cert?: number;

  @IsOptional()
  @IsNumber()
  special?: number;

  @IsOptional()
  @IsNumber()
  series?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;
}
