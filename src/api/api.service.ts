import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  findAll() {
    return 'This action returns all api';
  }
}
