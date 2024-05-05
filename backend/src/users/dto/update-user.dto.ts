import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({example: 'user1', description:'Имя пользователя'})
  @IsOptional()
  @IsString()
  @Length(2, 30)
  username?: string;

  @ApiProperty({example: 'ya@yandex.ru', description:'email'})
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({example: '1234', description:'Пароль'})
  @IsOptional()
  @IsString()
  @Length(6, 20)
  password?: string;

  @ApiProperty({example: 'example', description:'О пользователе'})
  @IsOptional()
  @IsString()
  @Length(2, 200)
  about?: string;

  @ApiProperty({example: 'https://i.pravatar.cc/150?img=3', description:'Аватар'})
  @IsOptional()
  @IsString()
  avatar?: string;
}
