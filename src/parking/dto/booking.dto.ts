import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { VehicleDto } from './vehicle.dto';


export class BookingDto {
  @ApiProperty({
    type: VehicleDto,
  })
  vehicle: VehicleDto;

  @ApiProperty({
    type: Date,
  })
  @IsString()
  startDate: Date;


  @ApiProperty({
    type: Date,
  })
  @IsString()
  endDate: Date;

}
