import { Exclude, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, MinLength, IsOptional, IsStrongPassword, MaxLength, Matches } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from '../../role/dto/role.dto';
import { StatusDto } from '../../status/dto/status.dto';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'alex.diaz@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  email: string | null;

  @ApiProperty({
    type: String,
    example: 'Yn&3!6wc',
  })
  @MinLength(8)
  @MaxLength(50)
  @IsStrongPassword( {},{message:'The password must be at least one uppercase letter, one lowercase letter, one number, one special character, and 8 in length.'} )
  password?: string;

  @ApiProperty({
    type: String,
    example: 'Alex',
  })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Diaz',
  })
  @IsNotEmpty()
  lastName: string | null;

  @ApiProperty({
    type: RoleDto,
  })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;

  @ApiProperty({
    type: StatusDto,
  })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto | null;


  

}
