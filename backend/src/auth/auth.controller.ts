import { Controller, Req, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';


@ApiTags('Регистрация/авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  /**
   * Стратегия local автоматически достанет username и password из тела запроса
   * Если пароль будет верным, данные пользователя окажутся в объекте req.user
   */
  @ApiOperation({summary: 'Авторизация пользователя'})
  @ApiResponse({status:200, type: User})
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req) {
    /* Генерируем для пользователя JWT-токен */
    return this.authService.auth(req.user);
  }

  @ApiOperation({summary: 'Регистрация пользователя'})
  @ApiResponse({status:200, type: User})
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    /* При регистрации создаём пользователя и генерируем для него токен */
    const user = await this.usersService.create(createUserDto);
    return this.authService.auth(user);
  }
}
