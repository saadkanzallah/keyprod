import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const jwtFactory = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET_KEY'),
    signOptions: { 
      expiresIn: configService.get('JWT_EXPIRES_IN')
    },
  }),
  inject: [ConfigService]
}

@Module({
  imports: [
    JwtModule.registerAsync(jwtFactory),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
