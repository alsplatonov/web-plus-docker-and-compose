import {
  Controller,
  Post,
  Get,
  Req,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Предложения')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }

  @ApiOperation({ summary: 'Создать предложение' })
  @ApiResponse({ status: 200, type: Offer })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req,
  ): Promise<Offer> {
    return this.offersService.create(createOfferDto, req.user);
  }

  @ApiOperation({ summary: 'Найти все предложения' })
  @ApiResponse({ status: 200, type: [Offer] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @ApiOperation({ summary: 'Найти предложение по id' })
  @ApiResponse({ status: 200, type: Offer })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: number): Promise<Offer> {
    return this.offersService.findById(id);
  }
}
