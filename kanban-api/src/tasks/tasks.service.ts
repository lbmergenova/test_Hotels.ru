import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  
  async create(createTaskDto: CreateTaskDto, projectId: number) {
    try {
      const project = await this.prisma.project.findUnique({
        where: {id: projectId},
        include: {
          columns: {
            where: {id: createTaskDto.columnId}
          }
        }
      });
      if (!project) {
        throw new BadRequestException('Invalid columns ID');
      }
      const position = await this.nextPosition(createTaskDto.columnId);
      return await this.prisma.task.create({
        data: {
          ...createTaskDto,
          position: position+1,
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating task');
    }
  }

  async findAll(id: number) {
    return await this.prisma.task.findMany({
      where: {
        column: {
          projectId: id,
        }
      }
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: {id},
    });
    if (!task) {
      throw new NotFoundException({message: 'Task not found'});
    }
    return task ;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {id}
      });
      if (updateTaskDto.columnId !== task.columnId) {
        if (updateTaskDto.position) {
          await this.updateColumn(updateTaskDto.position, updateTaskDto.columnId, 'increment');          
          await this.updateColumn(task.position+1, task.columnId, 'decrement');          
        } else {
          updateTaskDto.position = await this.nextPosition(updateTaskDto.columnId);
          await this.updateColumn(task.position+1, task.columnId, 'decrement');          
        }
      } else if (updateTaskDto.position !== task.position) {
        const maxPosition = await this.nextPosition(task.columnId);
        const oldPosition = task.position;
        if (maxPosition < updateTaskDto.position) {
          throw new BadRequestException('Invalid new position for task');
        }
        if (oldPosition < updateTaskDto.position) {
          this.updateManyPosition(oldPosition+1, updateTaskDto.position, 'decrement');
        } else if (updateTaskDto.position < oldPosition) {
          this.updateManyPosition(updateTaskDto.position, oldPosition-1, 'increment');
        }        
      }
      return await this.prisma.task.update({
        where: {id},
        data: updateTaskDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Task not found');
      }
      throw error;     
    }
  }

  async remove(id: number) {
    try {
      const delTask = await this.prisma.task.delete({
        where: {id},
      });
      await this.updateColumn(delTask.position, delTask.columnId, 'decrement');
      return delTask;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Task not found')
      }
      throw new InternalServerErrorException('Error deleting task')
    }
  }

  private async nextPosition(columnId: number) {
    const position = await this.prisma.task.count({
      where: {
        columnId: columnId,
      }
    });
    return position+1;
  }

  private async updateManyPosition(startPosition: number, endPosition: number, operation: 'increment' | 'decrement') {
    await this.prisma.column.updateMany({
      where: {
        position: {
          gte: startPosition,
          lte: endPosition,
        }
      },
      data: {
        position: {
          [operation]: 1,
        }
      }
    });
  }

  private async updateColumn(startPosition: number, columnId: number, operation: 'increment' | 'decrement') {
    await this.prisma.task.updateMany({
      where: {
        columnId: columnId,
        position: {
          gte: startPosition,
        }
      },
      data: {
        position: {
          [operation]: 1,
        }
      }
    });
  }

  async getProjectId(id: number) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {id},
        include: {
          column: {
            select: {
              projectId: true,
            }
          }
        }
      });
      return task.column.projectId;
    } catch (error) {
      throw new NotFoundException({message: 'Task not found'});
    }
  }
}
