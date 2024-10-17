import { Body, Controller, Post, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/domain/user.domain';
import { AuthRoleGuard } from './guard/auth-role.guard';
import { Token } from './decorator/token.decorator';
import { ValidRoles } from './interface/valid-roles';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignUpDto) : Promise<{user: User, token : string}> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) : Promise<{user: User, token : string}>{
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthRoleGuard)
  @SetMetadata('validRoles', [ValidRoles.client, ValidRoles.admin ])
  @Get('verify')
  verify( @Token() token : string) {
    return this.authService.verifyToken(token);
  }

}
