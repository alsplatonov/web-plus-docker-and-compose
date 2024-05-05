import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const wishes = await this.wishesService.findOne(createOfferDto.itemId);
    const wish = await this.wishesService.findOne(wishes.id);
    const newRise = Number(wish.raised) + Number(createOfferDto.amount);
    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Вы не можете поддерживать свои подарки');
    }

    if (wish.raised === wish.price) {
      throw new ForbiddenException('На данный подарок уже собрана вся сумма');
    }

    if (createOfferDto.amount > wish.price || createOfferDto.amount > wish.price - wish.raised) {
      throw new ForbiddenException('Сумма предложения выше стоимости подарка');
    }

    wish.raised = newRise;
    await this.wishesService.updateRaised(
      createOfferDto.itemId,
      user.id,
      newRise,
    ); //обновим wish
    const offerDto = { ...createOfferDto, user: user, item: wish };
    return await this.offerRepository.save(offerDto);
  }

  async findById(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      relations: { user: true, item: true },
      where: { id },
    });
    if (!offer) {
      throw new NotFoundException();
    }
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find({
      relations: { user: true, item: true },
    });
  }
}
