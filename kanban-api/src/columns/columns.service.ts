import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  async create(createColumnDto: CreateColumnDto, projectId: number) {
    try {
      const position = await this.nextPosition(projectId)
      return await this.prisma.column.create({
        data: {
          ...createColumnDto,
          position: position,
          projectId: projectId,
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating column');
    }
  }

  async findAll(id: number) {
    return await this.prisma.column.findMany({
      where: {
        projectId: id,
      }
    });
  }

  async findOne(id: number) {
    const column = await this.prisma.column.findUnique({
      where: {id},
    });
    if (!column) {
      throw new NotFoundException({message: 'Column not found'});
    }
    return column ;
  }

  async update(id: number, updateColumnDto: UpdateColumnDto, projectId: number) {
    try {
      const column = await this.findOne(id);
      const oldPosition = column.position;
      if (updateColumnDto.position !== oldPosition) {
        const maxPosition = await this.nextPosition(projectId)
        if (maxPosition < updateColumnDto.position) {
          throw new BadRequestException('Invalid new position for column')
        }
        if (oldPosition < updateColumnDto.position) {
          this.updateManyPosition(oldPosition+1, updateColumnDto.position, 'decrement');
        } else if (updateColumnDto.position < oldPosition) {
          this.updateManyPosition(updateColumnDto.position, oldPosition-1, 'increment');
        } 
      }
      return await this.prisma.column.update({
        where: {id},
        data: updateColumnDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Column not found');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const delColumn = await this.prisma.column.delete({
        where: {id},
      });
      await this.updateManyPositionForDel(delColumn.position);
      return delColumn;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Column not found')
      }
      throw new InternalServerErrorException('Error deleting column')
    }
  }

  private async nextPosition(projectId: number) {
    const position = await this.prisma.column.count({
      where: {
        projectId: projectId,
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

  private async updateManyPositionForDel(startPosition: number) {
    await this.prisma.column.updateMany({
      where: {
        position: {
          gte: startPosition,
        }
      },
      data: {
        position: {
          decrement: 1,
        }
      }
    });
  }
}
