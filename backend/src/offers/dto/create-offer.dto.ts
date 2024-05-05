import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({example: '1', description:'Сумма заявки'})
  @IsNumber()
  amount: number;

  @ApiProperty({example: 'true', description:'Показывать ли информацию о скидывающемся в списке'})
  @IsBoolean()
  hidden: boolean;

  @ApiProperty({example: '1', description:'id товара'})
  @IsNumber()
  itemId: number;
}
