import { Body, Controller, Get,Param, Post } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Log')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}


  @Get()
  findAll() {
    return this.logService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logService.findOne(id);
  }

  @Post()
  create(@Body('id') id: string){
    return this.logService.create(id);
  }

}
