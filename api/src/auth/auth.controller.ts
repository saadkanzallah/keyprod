import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('Authification')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(@Body() { email, password }: SigninDto) {
    return this.authService.signin(email, password);
  }

  @UseGuards(AuthGuard())
  @Post('logout')
  logout() {
    // TODO
    return 'logout';
  }
}
