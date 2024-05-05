import {
  Injectable,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const email = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (email) {
      throw new ForbiddenException(
        'Пользователь с таким e-mail уже существует',
      );
    }
    createUserDto.password = await bcrypt.hash(createUserDto?.password, 5);
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async getCurrentUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    /* Исключаем пароль из результата */
    const { password, ...result } = user;
    return result;
  }

  async update(user: User, userDto: UpdateUserDto): Promise<User> {
    const { id } = user;
    const { email } = userDto;
    if (userDto.password) {
      //захешируем
      userDto.password = await bcrypt.hash(userDto.password, 5);
    }
    //проверим, что с таким email больше нет пользователей
    const existUser = await this.usersRepository.findOne({
      where: [{ email }],
    });

    if (existUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    try {
      await this.usersRepository.update(id, userDto);
      const { password, ...user } = await this.usersRepository.findOneBy({
        id,
      });
      return user;
    } catch (e) {
      throw new BadRequestException(
        'Пользователь может редактировать только собственный профиль',
      );
    }
  }

  async findWishesById(id: number): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: { wishes: true, offers: true },
      where: { id },
    });
    return users;
  }

  async findOne(field: string, value: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { [field]: value },
    });
    if (!user) {
      throw new NotFoundException(
        `Пользователь с ${field} '${value}' не найден`,
      );
    }
    return user;
  }

  async findMany(query: string): Promise<User[]> {
    const searchResult = await this.usersRepository.find({
      where: [
        //ИЛИ
        { email: Like(`%${query}%`) },
        { username: Like(`%${query}%`) },
      ],
    });

    return searchResult;
  }
}
