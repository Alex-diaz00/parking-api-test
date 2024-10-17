import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Go to http://localhost:3000/api/ to see swagger docs';
  }
}
