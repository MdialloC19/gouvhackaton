import { Injectable } from '@nestjs/common';
import { CreateCitoyenDto } from './dto/create-citoyen.dto';
import { UpdateCitoyenDto } from './dto/update-citoyen.dto';

@Injectable()
export class CitoyenService {
  create(createCitoyenDto: CreateCitoyenDto) {
    return 'This action adds a new citoyen';
  }

  findAll() {
    return `This action returns all citoyen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} citoyen`;
  }

  update(id: number, updateCitoyenDto: UpdateCitoyenDto) {
    return `This action updates a #${id} citoyen`;
  }

  remove(id: number) {
    return `This action removes a #${id} citoyen`;
  }
}
