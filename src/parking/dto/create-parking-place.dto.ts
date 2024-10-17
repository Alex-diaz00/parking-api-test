import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateParkingPlaceDto {
  @ApiProperty({
    type: String,
    example: "A1",
  })
  @IsString()
  name: string;

  constructor(name: string){this.name = name;}
}
