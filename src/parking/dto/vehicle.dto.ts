import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VehicleDto {
  @ApiProperty({
    type: String,
    example: "B840624",
  })
  @IsString()
  numberplate: string;

  constructor(numberplate: string){this.numberplate = numberplate;}
}
