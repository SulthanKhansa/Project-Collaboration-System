import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getInfo() {
    return {
      name: 'Project Collaboration System API',
      status: 'ok',
    };
  }
}
