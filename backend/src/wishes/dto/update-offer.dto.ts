import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl } from 'class-validator';

export class UpdateWishDto {
  @ApiProperty({ example: 'wish1', description: 'Название подарка' })
  @IsString()
  name?: string;

  @ApiProperty({ example: 'string', description: 'Название подарка' })
  @IsUrl()
  link?: string;

  @ApiProperty({ example: 'string', description: 'Ссылка на изображение подарка' })
  @IsUrl()
  image?: string;

  @ApiProperty({ example: '1', description: 'Цена подарка' })
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 'string', description: 'Описание подарка' })
  @IsString()
  description?: string;

  @ApiProperty({ example: '1', description: 'Сумма предложения' })
  @IsNumber()
  raised?: number;
}
