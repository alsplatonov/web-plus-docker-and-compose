import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { omit } from 'lodash';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: User,
  ): Promise<Wishlist> {
    const items = [];
    console.log(owner);
    const { name, image, description } = createWishlistDto;
    for (const item of createWishlistDto.itemsId) {
      //находим каждый подарок и добавляем в массив
      const wish = await this.wishesService.findOne(item);
      items.push(wish);
    }
    const ownerWithoutSensitiveInfo = omit(owner, ['email', 'password']);
    owner = ownerWithoutSensitiveInfo;
    const savedDescription = description ? description : '';
    return await this.wishlistsRepository.save({
      image,
      name,
      description: savedDescription,
      owner,
      items,
    });
  }

  async findAll(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistsRepository.find({
      relations: { owner: true, items: true },
    });
    if (!wishlists) {
      throw new BadRequestException('Ничего не найдено');
    }
    return wishlists;
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    if (!wishlist) {
      throw new BadRequestException('Ничего не найдено');
    }
    return wishlist;
  }

  async delete(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    console.log(wishlist);
    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException('Нельзя удалять чужой вишлист');
    }
    try {
      await this.wishlistsRepository.remove(wishlist);
      return wishlist;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });

    if (user.id !== wishlist?.owner?.id) {
      throw new BadRequestException('Вы не можете изменять чужой вишлист');
    }
    const ownerWithoutSensitiveInfo = omit(wishlist.owner, [
      'email',
      'password',
    ]);
    wishlist.owner = ownerWithoutSensitiveInfo;
    const updWishlist = await this.wishlistsRepository.save({
      id: wishlist.id,
      itemsId: updateWishlistDto.itemsId
        ? updateWishlistDto.itemsId
        : wishlist.items,
      name: updateWishlistDto.name ? updateWishlistDto.name : wishlist?.name,
      image: updateWishlistDto.image
        ? updateWishlistDto.image
        : wishlist?.image,
      owner: wishlist.owner,
    });
    return updWishlist;
  }
}
