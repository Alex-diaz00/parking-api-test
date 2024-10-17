import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StatusDto {
  @ApiProperty({
    type: String,
    example: "active",
  })
  @IsString()
  name:  string;

  constructor(name: string){this.name = name;}
}
