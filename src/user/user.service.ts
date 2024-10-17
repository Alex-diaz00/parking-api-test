import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './domain/user.domain';
import { Role } from '../role/domain/role.domain';
import { Status } from '../status/domain/status.domain';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Status)
    private statusesRepository: Repository<Status>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('User not found');
  }

  async findByEmail(email: string): Promise<User> {

    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
      select:{ password: true, id :true, firstName:true,
        lastName :true, email:true
       }
    });

    return user ? user : null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    let password: string | undefined = undefined;
 
    if (createUserDto.password) {
      const salt = await bcrypt.genSalt(10);

      password = await bcrypt.hash(createUserDto.password, salt);

      createUserDto.password = password;
    }

    if (createUserDto.email) {
      const userObject = await this.findByEmail(createUserDto.email);
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'Email already exists',
          },
        });
      }
    }

    let role: Role | null = null;

    const roles = await this.rolesRepository.find();
    if (createUserDto.role) {
      const exist = roles.find(role => role.name === createUserDto.role?.name);
      if (!exist) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'Role not exists',
          },
        });
      }

      role = exist;

    }

    let status: Status | null = null;

    const statuses = await this.statusesRepository.find();

    if (createUserDto.status?.name) {
      const exist = statuses.find(status => status.name === createUserDto.status?.name);
      if (!exist) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'Status not exists',
          },
        });
      }
      status = exist;
   
    }

    const user = this.usersRepository.create(createUserDto);
    user.role = role;
    user.status = status;

    await this.usersRepository.insert(user);
  
    const {password: _, ...userReturned} = user;
    
    return userReturned;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    let password: string | undefined = undefined;
  
    if (updateUserDto.password) {
      const userObject = await this.findById(id);

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;

    if (updateUserDto.email) {
      const userObject = await this.findByEmail(updateUserDto.email);

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'Email already exists',
          },
        });
      }

      email = updateUserDto.email;
    } else if (updateUserDto.email === null) {
      email = null;
    }

    let role: Role | null = null;

    const roles = await this.rolesRepository.find();

    if (updateUserDto.role?.name) {
      const exist = roles.find(role => role.name === updateUserDto.role?.name);
    
      if (!exist) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'Role not exists',
          },
        });
      }
      role = exist;

    }

    let status: Status | null = null;

    const statuses = await this.statusesRepository.find();

    if (updateUserDto.status?.name) {

      const exist = statuses.find(status => status.name === updateUserDto.status?.name);
      if (!exist) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'Status not exists',
          },
        });
      }
      status = exist;
    }

    const user = await this.findById(id);

    user.password = password ? password : user.password;
    user.email = email ? email : user.email;
    user.role = role ? role : user.role;
    user.status = status ? status : user.status;
    user.firstName = updateUserDto.firstName
      ? updateUserDto.firstName
      : user.firstName;
    user.lastName = updateUserDto.lastName
      ? updateUserDto.lastName
      : user.lastName;

    await this.usersRepository.update({ id: id }, user);

    const {password: _, ...userReturned} = user;

    return userReturned;
  }

  async remove(id: number): Promise<User> {
    const user = await this.findById(id);
    return await this.usersRepository.remove(user);
  }
}
