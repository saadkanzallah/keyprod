import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

type JwtPayload = {
    email: string,
    sub: number,
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy, 
    'jwt'
) {
    constructor(
        configService: ConfigService,
        private prismaService: PrismaService,
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        })
    }

    async validate(payload: JwtPayload) {
        const user = await this.prismaService.user.findUnique({ where: { email: payload.email } });
        if (!user) throw new UnauthorizedException('Unauthorized');
        Reflect.deleteProperty(user, 'password');

        return user;
    }
}
