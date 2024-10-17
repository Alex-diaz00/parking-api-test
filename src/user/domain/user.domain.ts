import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
// import { Role } from 'src/role/domain/role.domain';
import { Role } from '../../role/domain/role.domain';
import { Status } from '../../status/domain/status.domain';

export class User {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  email: string | null;

  @ApiProperty({
    type: String,
    example: 'Yn&3!6wc',
  })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

  @ApiProperty({
    type: () => Role,
  })
  role: Role | null;

  @ApiProperty({
    type: () => Status,
  })
  status: Status;
}
