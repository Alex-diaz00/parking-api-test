import { Exclude, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, Allow } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

import { ApiProperty } from '@nestjs/swagger';


export class LoginDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  password: string;

}
