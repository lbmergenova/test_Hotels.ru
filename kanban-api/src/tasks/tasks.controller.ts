import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Task } from './entities/task.entity';
import { AuthOwnerGuard } from 'src/auth/auth-owner.guard';
import { TaskOwnershipGuard } from 'src/auth/task-ownership.guard';

@ApiTags('Задачи')
@UseGuards(AuthOwnerGuard)
@UseGuards(AuthGuard)
@Controller('projects/:id/tasks')
export class TasksController {
  constructor(private readonly TasksService: TasksService) {}

  @ApiOperation({summary: 'Создание задачи'})
  @ApiResponse({status: 201, type: Task})
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Param('id') projectId: number) {
    return this.TasksService.create(createTaskDto, projectId);
  }
  
  @ApiOperation({summary: 'Получение всех задач проекта'})
  @ApiResponse({status: 200, type: [Task]})
  @Get()
  findAll(@Param('id') id: number) {
    return this.TasksService.findAll(+id);
  }

  @ApiOperation({summary: 'Получение задачи по id для выбранного проекта'})
  @ApiResponse({status: 200, type: Task})
  @UseGuards(TaskOwnershipGuard)
  @Get(':taskId')
  findOne(@Param('taskId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.TasksService.findOne(+id);
  }

  @ApiOperation({summary: 'Обновление задачи по id для выбранного проекта'})
  @ApiResponse({status: 200, type: Task})
  @UseGuards(TaskOwnershipGuard)
  @Patch(':taskId')
  update(@Param('taskId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.TasksService.update(+id, updateTaskDto);
  }

  @ApiOperation({summary: 'Удаление задачи по id для выбранного проекта'})
  @ApiResponse({status: 204})
  @UseGuards(TaskOwnershipGuard)
  @Delete(':taskId')
  remove(@Param('taskId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.TasksService.remove(+id);
  }
}
