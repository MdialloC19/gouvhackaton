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

@Controller('admins')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post()
    async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
        return this.adminService.create(createAdminDto);
    }

    @Get()
    async findAll(): Promise<Admin[]> {
        return this.adminService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Admin> {
        return this.adminService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateAdminDto: UpdateAdminDto,
    ): Promise<Admin> {
        return this.adminService.update(id, updateAdminDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.adminService.delete(id);
    }
}
