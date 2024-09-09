import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    ) {}

    async create(createAdminDto: CreateAdminDto): Promise<Admin> {
        const createdAdmin = new this.adminModel(createAdminDto);
        return createdAdmin.save();
    }

    async findAll(): Promise<Admin[]> {
        return this.adminModel.find().exec();
    }

    async findOne(id: string): Promise<Admin> {
        const admin = await this.adminModel.findById(id).exec();
        if (!admin) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }
        return admin;
    }

    async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
        const existingAdmin = await this.adminModel
            .findByIdAndUpdate(id, updateAdminDto, {
                new: true,
            })
            .exec();
        if (!existingAdmin) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }
        return existingAdmin;
    }

    async delete(id: string): Promise<void> {
        const result = await this.adminModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }
    }
}
