import {
  IsString,
  MaxLength,
  MinLength,
  IsDate,
  IsInt,
  IsUrl,
} from 'class-validator';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wishlist {
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

  @ApiProperty({example: 'string', description:'Название списка'})
  @Column()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @ApiProperty({example: 'string', description:'Описание списка'})
  @Column()
  @IsString()
  @MinLength(1, {
    message: 'Минимум 1 символ',
  })
  @MaxLength(1500, {
    message: 'Макс. 1500 символов',
  })
  description: string;

  @ApiProperty({example: 'string', description:'Ссылка на изображение'})
  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  @ApiProperty({
    description: 'Массив элементов списка',
    type: () => [Wish] // Указываем тип данных, который относится к данному отношению
  })
  items: Wish[];

  @ManyToOne(() => User)
  @ApiProperty({
    description: 'Владелец списка',
    type: () => User // Указываем тип данных, который относится к данному отношению
  })
  owner: User;
}
