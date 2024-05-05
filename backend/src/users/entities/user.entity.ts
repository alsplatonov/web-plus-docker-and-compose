import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import {
  IsString,
  MaxLength,
  MinLength,
  IsDate,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
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

  @ApiProperty({example: 'user1', description:'Имя пользователя'})
  @Column()
  @MinLength(2, {
    message: 'Минимум 2 символа',
  })
  @MaxLength(30, {
    message: 'Макс. 30 символов',
  })
  @IsString()
  username: string;

  @ApiProperty({example: 'exampleuser', description:'О пользлвателе'})
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @MinLength(2, {
    message: 'Минимум 2 символа',
  })
  @MaxLength(200, {
    message: 'Макс. 200 символов',
  })
  @IsString()
  about: string;

  @ApiProperty({example: 'https://i.pravatar.cc/150?img=3', description:'Аватар'})
  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @ApiProperty({example: 'user5@yandex.ru', description:'email'})
  @Column({ unique: true })
  email: string;

  @ApiProperty({example: '1234', description:'Пароль'})
  @Column()
  @IsOptional()
  @IsString()
  password?: string;

  @OneToMany(() => Wish, (wish: Wish) => wish.owner, { onDelete: 'CASCADE' }) //каскадное удаление - при удалении юзера удаляются и все подарки
  @ApiProperty({
    description: 'Список желаний пользователя',
    type: () => [Wish] // Указываем тип данных, который относится к данному отношению
  })
  wishes: Wish[];

  @OneToMany(() => Offer, (offer: Offer) => offer.user, { onDelete: 'CASCADE' })
  @ApiProperty({
    description: 'Список предложений пользователя',
    type: () => [Offer] // Указываем тип данных, который относится к данному отношению
  })
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist: Wishlist) => wishlist.owner, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    description: 'Список вишлистов пользователя',
    type: () => [Wishlist] // Указываем тип данных, который относится к данному отношению
  })
  wishlists: Wishlist[];
}
