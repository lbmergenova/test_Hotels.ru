import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Project } from './entities/project.entity';
import { AuthOwnerGuard } from 'src/auth/auth-owner.guard';
import { UserId } from 'src/users/userId.decorator';

@ApiTags('Проекты')
@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({summary: 'Создание проекта'})
  @ApiResponse({status: 201, type: Project})
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @UserId() UserId: number) {
    return this.projectsService.create(createProjectDto, UserId);
  }

  @ApiOperation({summary:'Получение всех проектов пользователя'})
  @ApiResponse({status: 200, type: [Project]})
  @Get()
  findAll(@UserId() UserId: number) {
    return this.projectsService.findAll(UserId);
  }
  
  @ApiOperation({summary:'Получение проекта по id'})
  @ApiResponse({status: 200, type: Project})
  @UseGuards(AuthOwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  } 

  @ApiOperation({summary:'Детализация проекта по id'})
  @ApiResponse({status: 200, type: Project})
  @UseGuards(AuthOwnerGuard)
  @Get(':id/details')
  getOneDetails(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.projectsService.getOneDetails(+id);
  }

  @ApiOperation({summary:'Обновление проекта по id'})
  @ApiResponse({status: 200, type: Project})
  @UseGuards(AuthOwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @ApiOperation({summary:'Удаление проекта по id'})
  @ApiResponse({status: 204})
  @UseGuards(AuthOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
