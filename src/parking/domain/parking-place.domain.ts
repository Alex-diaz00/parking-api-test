import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { Booking } from './booking.domain';

export class ParkingPlace {
  @Allow()
  @ApiProperty({
    type: Number,
  })
  id: number;

  @Allow()
  @ApiProperty({
    type: String,
    example: 'A1',
  })
  name: string;

  @Allow()
  @ApiProperty({
    type: [Booking],
  })
  bookings: Booking[];

}
