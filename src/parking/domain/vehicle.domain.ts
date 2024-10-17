import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class Vehicle {
  @Allow()
  @ApiProperty({
    type: Number,
  })
  id: number;

  @Allow()
  @ApiProperty({
    type: String,
    example: "B840624",
  })
  numberplate: string;

}
