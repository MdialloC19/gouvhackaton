import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Institution } from './institution.schema';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institution.name) private readonly institutionModel: Model<Institution>,
  ) {}

  async create(createInstitutionDto: CreateInstitutionDto): Promise<Institution> {
    try {
      const createdInstitution = new this.institutionModel(createInstitutionDto);
      return createdInstitution.save();
    } catch (error) {
      throw new BadRequestException('Failed to create institution');
    }
  }

  async findAll(): Promise<Institution[]> {
    return this.institutionModel.find().exec();
  }

  async findOne(id: string): Promise<Institution> {
    const institution = await this.institutionModel.findById(id).exec();
    if (!institution) {
      throw new NotFoundException('Institution not found');
    }
    return institution;
  }

  async update(id: string, updateInstitutionDto: UpdateInstitutionDto): Promise<Institution> {
    const updatedInstitution = await this.institutionModel.findByIdAndUpdate(id, updateInstitutionDto, { new: true }).exec();
    if (!updatedInstitution) {
      throw new NotFoundException('Institution not found');
    }
    return updatedInstitution;
  }

  async remove(id: string): Promise<any> {
    const result = await this.institutionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Institution not found');
    }
    return { message: 'Institution deleted successfully' };
  }
}
