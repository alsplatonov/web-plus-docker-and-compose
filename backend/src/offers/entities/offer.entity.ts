import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsBoolean, IsInt, IsDate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Offer {
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

  @ManyToOne(() => User, (user) => user.offers)
  @ApiProperty({
    description: 'Владелец предлождения',
    type: () => User // Указываем тип данных, который относится к данному отношению
  })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @ApiProperty({
    description: 'Список желаний пользователя',
    type: () => [Wish] // Указываем тип данных, который относится к данному отношению
  })
  item: Wish;

  @ApiProperty({example: '1', description:'Сумма заявки'})
  @Column({ type: 'decimal', scale: 2 })
  amount: number;

  @ApiProperty({example: 'true', description:'Показывать ли информацию о скидывающемся в списке'})
  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
