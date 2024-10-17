import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OneDateDto {
  @ApiProperty({
    type: Date,
  })
  @IsString()
  date?: Date;

}
