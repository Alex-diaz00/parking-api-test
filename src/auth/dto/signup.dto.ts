import { Exclude, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, MinLength, IsOptional, IsStrongPassword, MaxLength, Matches, isValidationOptions } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

import { ApiProperty } from '@nestjs/swagger';


export class SignUpDto {
  @ApiProperty({
    type: String,
    example: 'alex.diaz@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  email: string;

  @ApiProperty({
    type: String,
    example: 'Yn&3!6wc',
  })
  @Exclude({ toPlainOnly: true })
  @MinLength(6)
  @MaxLength(50)
  @IsStrongPassword( {},{message:'The password must be at least one uppercase letter, one lowercase letter, one number, one special character, and 8 in length.'} )
  password: string;

  @ApiProperty({
    type: String,
    example: 'Alex',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: String,
    example: 'Diaz',
  })
  @IsNotEmpty()
  lastName: string;

}
