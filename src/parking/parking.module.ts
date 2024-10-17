import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { ParkingPlace } from './entities/parking.entity';
import { Booking } from './entities/booking.entity';
import { Vehicle } from './entities/vehicle.entity';
import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../log/log.module';



@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, ParkingPlace, Booking ]),
  ConfigModule , JwtModule, AuthModule, LogModule],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule {}
