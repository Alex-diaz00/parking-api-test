import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatusService } from './status.service';
import { StatusDto } from './dto/status.dto';
import { Status } from './domain/status.domain';

@ApiTags('Status')
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  create(@Body() createStatusDto: StatusDto) : Promise<Status> {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  findAll() : Promise<Status[]>  {
    return this.statusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe)  id: number) : Promise<Status>  {
    return this.statusService.findById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateStatusDto: StatusDto) : Promise<Status>  {
    return this.statusService.update(id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.remove(id);
  }
}
