import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Req,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Подарки')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @ApiOperation({summary: 'Создать подарок'})
  @ApiResponse({status:200, type: Wish})
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @Req() req,
  ): Promise<Wish> {
    return this.wishesService.create(createWishDto, req.user);
  }

  @ApiOperation({summary: 'Получить подарки из хвоста списка (до 40 шт)'})
  @ApiResponse({status:200, type: [Wish]})
  @Get('last')
  async getLast(): Promise<Wish[]> {
    return this.wishesService.findByOrder({ createdAt: 'DESC' }, 40);
  }

  @ApiOperation({summary: 'Получить подарки из головы списка (до 20 шт)'})
  @ApiResponse({status:200, type: [Wish]})
  @Get('top')
  async getTop(): Promise<Wish[]> {
    return this.wishesService.findByOrder({ copied: 'DESC' }, 20);
  }

  @ApiOperation({summary: 'Получить подарок по id'})
  @ApiResponse({status:200, type: Wish})
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOne(id);
  }

  @ApiOperation({summary: 'Обновить подарок по id'})
  @ApiResponse({status:200, type: Wish})
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish[]> {
    //передаем id юзера для проверки владения подарком
    return this.wishesService.update(id, req.user.id, updateWishDto);
  }

  @ApiOperation({summary: 'Удалить подарок по id'})
  @ApiResponse({status:200, type: Wish})
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req): Promise<Wish> {
    return this.wishesService.delete(id, req.user.id);
  }

  @ApiOperation({summary: 'Скопировать подарок по id'})
  @ApiResponse({status:200, type: Wish})
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(@Param('id') id: number, @Req() req): Promise<Wish> {
    return this.wishesService.copy(id, req.user);
  }
}
