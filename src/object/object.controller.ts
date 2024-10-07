import { Controller } from '@nestjs/common';
import { ObjectService } from './object.service';

@Controller('object')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}
}
