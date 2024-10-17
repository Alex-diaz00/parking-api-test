import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty({
    type: String,
    example: "admin",
  })
  @IsString()
  name: string;

  constructor(name: string){this.name = name;}
}
