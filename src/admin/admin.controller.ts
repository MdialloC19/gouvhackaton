import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './admin.schema';
import {
    ApiTags,
    ApiOperation,
    ApiResponse as SwaggerApiResponse,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';

@ApiTags('Admins')
@Controller('admins')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post()
    @ApiOperation({ summary: 'Créer un nouvel administrateur' })
    @ApiBody({ type: CreateAdminDto })
    @SwaggerApiResponse({
        status: 201,
        description: 'Administrateur créé avec succès.',
        type: Admin,
    })
    @SwaggerApiResponse({
        status: 500,
        description: "Échec de la création de l'administrateur.",
    })
    async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
        return this.adminService.create(createAdminDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtenir tous les administrateurs' })
    @SwaggerApiResponse({
        status: 200,
        description: 'Administrateurs récupérés avec succès.',
        type: [Admin],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des administrateurs.',
    })
    async findAll(): Promise<Admin[]> {
        return this.adminService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un administrateur par ID' })
    @ApiParam({
        name: 'id',
        description: "ID de l'administrateur",
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Administrateur récupéré avec succès.',
        type: Admin,
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Administrateur non trouvé.',
    })
    @SwaggerApiResponse({
        status: 500,
        description: "Échec de la récupération de l'administrateur.",
    })
    async findOne(@Param('id') id: string): Promise<Admin> {
        return this.adminService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour un administrateur par ID' })
    @ApiParam({
        name: 'id',
        description: "ID de l'administrateur",
        type: String,
    })
    @ApiBody({ type: UpdateAdminDto })
    @SwaggerApiResponse({
        status: 200,
        description: 'Administrateur mis à jour avec succès.',
        type: Admin,
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Administrateur non trouvé.',
    })
    @SwaggerApiResponse({
        status: 500,
        description: "Échec de la mise à jour de l'administrateur.",
    })
    async update(
        @Param('id') id: string,
        @Body() updateAdminDto: UpdateAdminDto,
    ): Promise<Admin> {
        return this.adminService.update(id, updateAdminDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un administrateur par ID' })
    @ApiParam({
        name: 'id',
        description: "ID de l'administrateur",
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Administrateur supprimé avec succès.',
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Administrateur non trouvé.',
    })
    @SwaggerApiResponse({
        status: 500,
        description: "Échec de la suppression de l'administrateur.",
    })
    async delete(@Param('id') id: string): Promise<void> {
        return this.adminService.delete(id);
    }
}
