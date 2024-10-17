import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { RoleModule } from './role/role.module';
import { StatusModule } from './status/status.module';
import { Status } from './status/entities/status.entity';
import { ParkingModule } from './parking/parking.module';
import { Booking } from './parking/entities/booking.entity';
import { ParkingPlace } from './parking/entities/parking.entity';
import { Vehicle } from './parking/entities/vehicle.entity';
import { LogModule } from './log/log.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      uri: config.get('MONGO_DATABASE_URI'),
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: parseInt(config.get('DATABASE_PORT')),
        username: config.get('DATABASE_USERNAME'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    AuthModule,
    UserModule,
    RoleModule,
    StatusModule,
    ParkingModule,
    LogModule
  ],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
