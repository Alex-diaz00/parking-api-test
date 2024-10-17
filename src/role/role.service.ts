import { HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './domain/role.domain';
import { Repository } from 'typeorm';
import { RoleDto } from './dto/role.dto';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}


  async create(createRoleDto: RoleDto) : Promise<Role> {
    if (createRoleDto.name){
      const exist = await this.findByName(createRoleDto.name);
      if (exist){
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'Role already exists',
          },
        });
      }
    }
    
    const role = this.rolesRepository.create(createRoleDto);
    await this.rolesRepository.insert(role);
    return role;
  }

  async findAll() : Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async findByName(name: string) : Promise<NullableType<Role>>{
    const role = await this.rolesRepository.findOne({
      where: {
        name: name,
      },
    });
    if (role) {
      return role;
    }
    return null;
  }

  async findById(id: number) : Promise<Role>  {
    const role = await this.rolesRepository.findOne({
      where: {
        id: id,
      },
    });
    if (role) {
      return role;
    }
    throw new NotFoundException('Role not found');
  }

  async update(id: number, updateRoleDto: RoleDto) : Promise<Role>  {

    if (updateRoleDto.name){
      const role = await this.findByName(updateRoleDto.name);
      if (role && role.id !== id ){
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'Role already exists',
          },
        });
      }
    }

    const role = await this.findById(id);

    if (updateRoleDto.name){
      role.name = updateRoleDto.name;
    }
    await this.rolesRepository.update(id, role);
    
    return role;
  }

  async remove(id: number) : Promise<Role>  {
    const role = await this.findById(id);
    return await this.rolesRepository.remove(role);
  }
}
