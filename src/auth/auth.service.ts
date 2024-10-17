import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/domain/user.domain';
import { SignUpDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { RoleDto } from '../role/dto/role.dto';
import { StatusDto } from '../status/dto/status.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interface/JwtPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    
    private readonly defaultRole = "client"
    private readonly defaultStatus = "active"
    constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      private configService: ConfigService
    ) {}
    
    async signup(signUpDto: SignUpDto) : Promise<{user : User, token: string}>{
        const role = new RoleDto(this.defaultRole);
        const status = new StatusDto(this.defaultStatus);

        const user = await this.userService.create({role: role, status: status, ...signUpDto});
        
        const jwtPayload: JwtPayload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role.name,
            status: user.status.name
          };

        return {
            user: user,
            token: this.getJwtToken(jwtPayload)
          };
    }

    async login(loginDto: LoginDto): Promise<{user: User, token : string}> {
        const { password, email } = loginDto;

        const user = await this.userService.findByEmail(email);


        if (!user)
            throw new UnauthorizedException('Credentials are not valid');

        if ( !bcrypt.compareSync( password, user.password ) )
            throw new UnauthorizedException('Credentials are not valid');
        
        const jwtPayload: JwtPayload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role.name,
            status: user.status.name
          };
        
        const {password: passwordHashed, ...returnedUser} = user;

        return {
            user: returnedUser,
            token: this.getJwtToken(jwtPayload)
          };
    }

    private getJwtToken( payload: JwtPayload ) {
        return this.jwtService.sign(payload);
      }

    async verifyToken(token : string) : Promise<{ user : JwtPayload, token :string}>{

      try {
 
        const { iat, exp, ...user} = this.jwtService.verify(token, {
          secret: this.configService.get('JWT_SECRET'),
        });

        const jwt = await this.jwtService.signAsync(user)
        const response = {user: user, token : jwt};
        
        return response

      } catch (error) {
        throw new UnauthorizedException('Invalid token')
      }

    }  

}
