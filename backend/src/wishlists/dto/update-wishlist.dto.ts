import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class UpdateWishlistDto {
  @ApiProperty({example: 'string', description:'Название списка'})
  @IsString()
  name?: string;

  @ApiProperty({example: 'string', description:'Описание списка'})
  @IsString()
  description?: string;

  @ApiProperty({example: 'string', description:'Ссылка на изображение'})
  @IsUrl()
  image?: string;

  itemsId?: number[];
}
