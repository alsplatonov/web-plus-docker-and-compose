import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { omit } from 'lodash';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { User } from '../users/entities/user.entity';
import { UpdateWishDto } from './dto/update-offer.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    const ownerWithoutSensitiveInfo = omit(owner, ['email', 'password']);
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: ownerWithoutSensitiveInfo,
    });
  }

  async findMany(field: string, value: any): Promise<Wish[]> {
    return await this.wishesRepository.findBy({
      [field]: value,
    });
  }

  async findByOrder(
    orderBy: Record<string, 'ASC' | 'DESC'>,
    take: number,
  ): Promise<Wish[]> {
    return this.wishesRepository.find({
      relations: { owner: true, offers: true },
      order: orderBy,
      take,
    });
  }

  async findOne(id: number): Promise<Wish> {
    return await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
  }

  async update(
    id: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish[]> {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (wish?.owner?.id !== userId) {
      throw new BadRequestException('Нельзя редактировать чужой подарок');
    }
    try {
      await this.wishesRepository.update(id, updateWishDto);
      const updatedWish = await this.wishesRepository.findBy({ id });
      return updatedWish;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async delete(id: number, userId: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (!wish || wish.owner.id !== userId) {
      throw new BadRequestException('Нельзя удалять чужой подарок');
    }
    try {
      await this.wishesRepository.remove([wish]);
      return wish;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async copy(id: number, user: User): Promise<Wish> {
    try {
      const wish = await this.wishesRepository.findOneBy({ id });
      wish.owner = omit(user, ['email', 'password']);
      delete wish.id; //удалим текущий id для автоматического создания нового
      return await this.wishesRepository.save(wish);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async updateRaised(
    id: number,
    userId: number,
    raised: number,
  ): Promise<Wish[]> {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (wish?.owner?.id == userId) {
      throw new BadRequestException('Нельзя скидываться на свой подарок');
    }
    try {
      await this.wishesRepository.update(id, { raised: raised });
      const updatedWish = await this.wishesRepository.findBy({ id });
      return updatedWish;
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
