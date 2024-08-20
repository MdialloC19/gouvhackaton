import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../interfaces/users.interface';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('Users') private readonly usersModel: Model<User>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersModel.findOne({
            number: createUserDto.number,
        });
        if (existingUser) {
            throw new HttpException(
                'Le numéro de téléphone existe déjà.',
                HttpStatus.BAD_REQUEST,
            );
        }

        const user = new this.usersModel(createUserDto);
        return user.save();
    }

    async updateUser(
        userId: string,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const user = await this.usersModel.findByIdAndUpdate(
            userId,
            updateUserDto,
            { new: true },
        );
        if (!user) {
            throw new HttpException(
                'Utilisateur introuvable.',
                HttpStatus.NOT_FOUND,
            );
        }
        return user;
    }

    async deleteUser(userId: string): Promise<User> {
        const user = await this.usersModel.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true },
        );
        if (!user) {
            throw new HttpException(
                'Utilisateur introuvable.',
                HttpStatus.NOT_FOUND,
            );
        }
        return user;
    }

    async getUserByNumber(number: string): Promise<User> {
        const user = await this.usersModel.findOne({ number });
        if (!user) {
            throw new HttpException(
                'Utilisateur introuvable.',
                HttpStatus.NOT_FOUND,
            );
        }
        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.usersModel.findOne({ email });
        if (!user) {
            throw new HttpException(
                'Utilisateur introuvable.',
                HttpStatus.NOT_FOUND,
            );
        }
        return user;
    }

    async getUserById(userId: string): Promise<User> {
        const user = await this.usersModel.findById(userId);
        if (!user) {
            throw new HttpException(
                'Utilisateur introuvable.',
                HttpStatus.NOT_FOUND,
            );
        }
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.usersModel.find();
        if (!users.length) {
            throw new HttpException(
                'Aucun utilisateur trouvé.',
                HttpStatus.NOT_FOUND,
            );
        }
        return users;
    }
}
