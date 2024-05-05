import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsNumber,
  IsString,
  IsInt,
  IsDate,
  IsUrl,
} from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wish {
  @ApiProperty({example: '1', description:'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @ApiProperty({example: '2024-03-03T20:45:39.264Z', description:'Дата создания'})
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @ApiProperty({example: '2024-03-03T20:45:39.264Z', description:'Дата обновления'})
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ApiProperty({example: 'wish1', description:'Название подарка'})
  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(1, {
    message: 'Минимум 1 символ',
  })
  @MaxLength(250, {
    message: 'Макс. 250 символов',
  })
  name: string;

  @ApiProperty({example: 'string', description:'Название подарка'})
  @Column()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  
  @ApiProperty({example: 'string', description:'Ссылка на изображение подарка'})
  @Column()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @ApiProperty({example: '1', description:'Цена подарка'})
  @Column({
    default: 0,
    type: 'decimal',
    scale: 2, //округление до сотых
  })
  @IsNumber()
  price: number;

  @ApiProperty({example: '1', description:'Сумма сбора'})
  @Column({
    default: 0,
    type: 'decimal',
    scale: 2,
  })
  @IsNumber()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @ApiProperty({
    description: 'Владелец подарка',
    type: () => User // Указываем тип данных, который относится к данному отношению
  })
  owner: User;

  @ApiProperty({example: 'string', description:'Описание подарка'})
  @Column()
  @IsString()
  @MinLength(1, {
    message: 'Минимум 1 символ',
  })
  @MaxLength(1024, {
    message: 'Макс. 1024 символов',
  })
  @IsNotEmpty()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  @ApiProperty({
    description: 'Список предложений',
    type: () => [Offer] 
  })
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  @ApiProperty({
    description: 'Список вишлистов',
    type: () => [Wishlist] 
  })
  wishlists: Wishlist[];

  @ApiProperty({example: '1', description:'Скопировано раз'})
  @Column({
    type: 'numeric',
    default: 0,
    precision: 10,
    scale: 2,
  })
  @IsNumber()
  copied: number;
}
