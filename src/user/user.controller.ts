import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './domain/user.domain';
import { AuthRoleGuard } from '../auth/guard/auth-role.guard';
import { ValidRoles } from '../auth/interface/valid-roles';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) : Promise<User> {
    return this.userService.create(createUserDto);
  }

  
  @Get()
  findAll() : Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id') 
  findOne(@Param('id', ParseIntPipe) id: number) : Promise<User> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthRoleGuard)
  @SetMetadata('validRoles', [ValidRoles.employee, ValidRoles.admin ])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) : Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) : Promise<User> {
    return this.userService.remove(id);
  }
}
