import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsOptional} from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({example: 'string', description:'Название списка'})
  @IsString()
  name: string;

  @ApiProperty({example: 'string', description:'Описание списка'})
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({example: 'string', description:'Ссылка на изображение'})
  @IsUrl()
  image: string;

  itemsId: number[];
}
