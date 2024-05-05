import {
  IsUrl,
  MaxLength,
  MinLength,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({example: 'user1', description:'Имя пользователя'})
  @IsString()
  @MinLength(2, {
    message: 'Минимум 2 символов',
  })
  @MaxLength(30, {
    message: 'Макс. 30 символов',
  })
  username: string;

  @IsOptional()
  @IsString()
  about: string;


  @IsOptional()
  @IsUrl()
  avatar: string;


  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({example: '1234', description:'Пароль'})
  @IsString()
  password: string;
}
