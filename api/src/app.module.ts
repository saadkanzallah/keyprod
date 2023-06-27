import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccessTokenStrategy } from './auth/strategy/accessToken.strategy';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule, PrismaModule],
  controllers: [],
  providers: [AccessTokenStrategy],
})
export class AppModule {}
