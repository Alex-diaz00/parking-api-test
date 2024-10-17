import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from './domain/role.domain';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: RoleDto) : Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() : Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) : Promise<Role> {
    return this.roleService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: RoleDto) 
  : Promise<Role>{
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) : Promise<Role> {
    return this.roleService.remove(+id);
  }
}
