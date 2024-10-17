import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { Vehicle } from './vehicle.domain';
import { User } from '../../user/domain/user.domain';
import { ParkingPlace } from './parking-place.domain';

export class Booking {

  @Allow()
  @ApiProperty({
    type: Number,
  })
  id: number;

  @Allow()
  @ApiProperty({
    type: Vehicle,
  })
  vehicle: Vehicle;

  @Allow()
  @ApiProperty({
    type: Date,
  })
  startDate: Date;

  @Allow()
  @ApiProperty({
    type: Date,
  })
  endDate: Date;

  @Allow()
  @ApiProperty({
    type: User,
  })
  user: User;

  @Allow()
  @ApiProperty({
    type: ParkingPlace,
  })
  parkingPlace: ParkingPlace;

  @Allow()
  @ApiProperty({
    type: Boolean,
  })
  isActive: boolean;

}
