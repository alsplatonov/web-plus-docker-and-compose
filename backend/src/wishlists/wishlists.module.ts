import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, Wish, User]),
    UsersModule,
    WishesModule,
  ],
  providers: [WishlistsService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
