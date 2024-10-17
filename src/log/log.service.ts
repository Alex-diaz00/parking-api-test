import { Injectable } from '@nestjs/common';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import { Log, LogDocument } from './schemas/log.schema';

@Injectable()
export class LogService {

  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async create(message: string) : Promise<Log> {
    const log : Log = {message:message};
    return await new this.logModel(log).save();
  }

  async findAll() : Promise<Log[]> {
    return await this.logModel.find().exec();
  }

  async findOne(id: string) : Promise<Log> {
    return await this.logModel.findById(id).exec();
  }


}
