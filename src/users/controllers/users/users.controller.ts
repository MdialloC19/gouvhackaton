import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    Delete,
    UsePipes,
    ValidationPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { ValidateCreateUserPipe } from '../../../common/pipes/validate-create-user-pipe/validate-create-user-pipe.pipe';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('create')
    @UsePipes(new ValidationPipe(), ValidateCreateUserPipe)
    async createUser(@Body() createUserDto: CreateUserDto) {
        try {
            const user = await this.usersService.createUser(createUserDto);
            return {
                success: true,
                message: 'Utilisateur ajouté avec succès',
                data: user,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Get()
    async getAllUsers() {
        try {
            const users = await this.usersService.getAllUsers();
            return {
                success: true,
                message: 'Liste des utilisateurs récupérée avec succès',
                data: users,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        try {
            const user = await this.usersService.getUserById(id);
            return {
                success: true,
                message: 'Utilisateur récupéré avec succès',
                data: user,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Get('number/:number')
    async getUserByNumber(@Param('number') number: string) {
        try {
            const user = await this.usersService.getUserByNumber(number);
            return {
                success: true,
                message:
                    'Utilisateur récupéré avec succès par numéro de téléphone',
                data: user,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Get('email')
    async getUserByEmail(@Query('email') email: string) {
        try {
            const user = await this.usersService.getUserByEmail(email);
            return {
                success: true,
                message: 'Utilisateur récupéré avec succès par email',
                data: user,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        try {
            const updatedUser = await this.usersService.updateUser(
                id,
                updateUserDto,
            );
            return {
                success: true,
                message: 'Utilisateur mis à jour avec succès',
                data: updatedUser,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        try {
            const deletedUser = await this.usersService.deleteUser(id);
            return {
                success: true,
                message: 'Utilisateur supprimé avec succès',
                data: deletedUser,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error instanceof HttpException) {
            return {
                success: false,
                message: error.message,
                statusCode: error.getStatus(),
            };
        } else {
            return {
                success: false,
                message: 'Erreur interne du serveur',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
