import {
  Controller,
  Req,
  Param,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

class UserQuery {
  @ApiProperty({ example: 'some@ya.ru' }) // Пример для свойства query
  query: string;
}

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) { }

  @ApiOperation({ summary: 'Вернуть текущего пользователя' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req): Promise<User> {
    return this.usersService.getCurrentUser(req.user.id);
  }

  @ApiOperation({ summary: 'Обновить текущего пользователя' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Req() req, @Body() UpdateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(req.user, UpdateUserDto);
  }

  @ApiOperation({ summary: 'Вернуть подарки текущего пользователя' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  async getMyWishes(@Req() req): Promise<User[]> {
    return this.usersService.findWishesById(req.user.id);
  }

  @ApiOperation({ summary: 'Получить пользователя по имени' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getUser(@Param('username') username): Promise<User> {
    return this.usersService.findOne('username', username);
  }

  @ApiOperation({ summary: 'Получить подарки пользователя по имени' })
  @ApiResponse({ status: 200, type: [Wish] })
  @UseGuards(JwtAuthGuard)
  @Get(':username/wishes')
  async getUsersWishes(@Param('username') username): Promise<Wish[]> {
    return this.wishesService.findMany('owner', { username });
  }

  @ApiOperation({ summary: 'Получить пользователя по части запроса' })
  @ApiBody({
    type: UserQuery,
  })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Post('find')
  async findUsers(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany(query);
  }
}
