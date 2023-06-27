import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwtService: JwtService,
    ) {}

    async signup(signupDto: SignupDto) {
        const {email, password, firstname, lastname} = signupDto;
        // ** Verify by email if user already signup
        const user = await this.prisma.user.findUnique({ where: { email } });

        // ** If user found, throw an error
        if (user) {
            throw new ConflictException(`User already exists with email: ${email}`);
        }

        // ** Hash password
        const hash = await bcrypt.hash(password, 10);

        // ** Save user in DB

        const newUser = await this.prisma.user.create({
            data: { firstname, lastname, email, password: hash}
        });
        

        // ** Generate a JWT containing the user's ID and return it
        return {
            accessToken: this.jwtService.sign({ userId: newUser.id }),
            user: newUser,
        };
    }

    async signin(email: string, password: string) {
        // ** Verify by email if user already signup
        const user = await this.prisma.user.findUnique({ where: { email: email } });

        // ** If no user is found, throw an error
        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`);
        }

        // ** Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // ** If password does not match, throw an error
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        // ** Generate a JWT containing the user's ID and return it
        return {
            accessToken: this.jwtService.sign({ email, sub: user.id }),
            user : {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
            },
        };
    }

    async logout(){
        // TODO
        return true;
    }
}
