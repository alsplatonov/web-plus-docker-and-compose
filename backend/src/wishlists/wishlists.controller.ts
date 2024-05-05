import {
  Controller,
  Post,
  Get,
  Delete,
  Req,
  Param,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Вишлисты')
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @ApiOperation({summary: 'Получить все вишлисты'})
  @ApiResponse({status:200, type: [Wishlist]})
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @ApiOperation({summary: 'Создать вишлист'})
  @ApiResponse({status:200, type: Wishlist})
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @ApiOperation({summary: 'Получить вишлист по id'})
  @ApiResponse({status:200, type: Wishlist})
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne(id);
  }

  @ApiOperation({summary: 'Удалить вишлист по id'})
  @ApiResponse({status:200, type: Wishlist})
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req): Promise<Wishlist> {
    return this.wishlistsService.delete(id, req.user);
  }

  @ApiOperation({summary: 'Обновить вишлист по id'})
  @ApiResponse({status:200, type: Wishlist})
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: number,
    @Req() req,
  ): Promise<Wishlist> {
    return this.wishlistsService.update(id, updateWishlistDto, req.user);
  }
}
