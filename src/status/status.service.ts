import { HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './domain/status.domain';
import { StatusDto } from './dto/status.dto';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class StatusService {

  constructor(
    @InjectRepository(Status)
    private statusesRepository: Repository<Status>,
  ) {}

  async create(createStatusDto: StatusDto) : Promise<Status> {
    if (createStatusDto.name){
      const exist = await this.findByName(createStatusDto.name);
      if (exist){
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'Status already exists',
          },
        });
      }
    }

    const status = this.statusesRepository.create(createStatusDto);
    await this.statusesRepository.insert(status);
    return status;
  }

  async findAll() : Promise<Status[]> {
    return await this.statusesRepository.find();
  }

  async findByName(name: string) : Promise<NullableType<Status>>{
    const status = await this.statusesRepository.findOne({
      where: {
        name: name,
      },
    });
    if (status) {
      return status;
    }
    return null;
  }

  async findById(id: number) : Promise<Status>{
    const status = await this.statusesRepository.findOne({
      where: {
        id: id,
      },
    });
    if (status) {
      return status;
    }
    throw new NotFoundException('Status not found');
  }

  async update(id: number, updateStatusDto: StatusDto) : Promise<Status> {

    if (updateStatusDto.name){
      const status = await this.findByName(updateStatusDto.name);
      if (status && status.id !== id){
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'Status already exists',
          },
        });
      }
    }

    const status = await this.findById(id);

    if (updateStatusDto.name){
      status.name = updateStatusDto.name;
    }
    await this.statusesRepository.update(id, status);
    
    return status;
  }

  async remove(id: number) : Promise<Status> {
    const status = await this.findById(id);
    return await this.statusesRepository.remove(status);
  }
}
