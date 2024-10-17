import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Status } from '../status/entities/status.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleService } from '../role/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Status]), 
  forwardRef(() => UserModule) ,
  JwtModule.registerAsync({
    imports: [ ConfigModule ],
    inject: [ ConfigService ],
    useFactory: ( configService: ConfigService ) => {
      return {
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn:'2h'
        }
      }
    }
  })],
  controllers: [AuthController],
  providers: [AuthService, UserService, ConfigService, RoleService],
  exports:[AuthService, UserService]
})
export class AuthModule {}
