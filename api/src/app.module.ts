import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccessTokenStrategy } from './auth/strategy/accessToken.strategy';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ParcelsModule } from './parcels/parcels.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    AuthModule, 
    PrismaModule, 
    ProductsModule, 
    OrdersModule, 
    ParcelsModule
  ],
  controllers: [],
  providers: [AccessTokenStrategy],
})
export class AppModule {}
