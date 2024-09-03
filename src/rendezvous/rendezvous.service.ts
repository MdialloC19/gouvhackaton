import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rendezvous } from './rendezvous.schema';
import { CreateRendezvousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezvousDto } from './dto/update-rendezvous.dto';

@Injectable()
export class RendezvousService {
    constructor(
        @InjectModel('Rendezvous') private readonly rendezvousModel: Model<Rendezvous>,
    ) {}

    async create(createRendezvousDto: CreateRendezvousDto): Promise<Rendezvous> {
        const createdRendezvous = new this.rendezvousModel(createRendezvousDto);
        return await createdRendezvous.save();
    }

    async findAll(): Promise<Rendezvous[]> {
        return await this.rendezvousModel.find().exec();
    }

    async findOne(id: string): Promise<Rendezvous> {
        const rendezvous = await this.rendezvousModel.findById(id).exec();
        if (!rendezvous) {
            throw new NotFoundException(`Rendezvous with ID ${id} not found`);
        }
        return rendezvous;
    }

    async update(id: string, updateRendezvousDto: UpdateRendezvousDto): Promise<Rendezvous> {
        const updatedRendezvous = await this.rendezvousModel
            .findByIdAndUpdate(id, updateRendezvousDto, { new: true })
            .exec();
        if (!updatedRendezvous) {
            throw new NotFoundException(`Rendezvous with ID ${id} not found`);
        }
        return updatedRendezvous;
    }

    async delete(id: string): Promise<void> {
        const result = await this.rendezvousModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Rendezvous with ID ${id} not found`);
        }
    }
}
