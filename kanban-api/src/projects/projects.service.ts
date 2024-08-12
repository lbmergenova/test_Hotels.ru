import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}
  
  async create(createProjectDto: CreateProjectDto, userId: number) {
    try {
      return await this.prisma.project.create({
        data: {
          ...createProjectDto,
          userId: userId,
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating project');
    }
  }

  async findAll(userId: number) {
    return await this.prisma.project.findMany(
      {where: { userId }},
    );
  }

  async findOne(id: number) {
    const project =  await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException({message: 'Project not found'});
    }
    return project;
  }

  async getOneDetails(id: number) {
    return await this.prisma.project.findUnique({
      where: { id },
      include: { 
        columns: {
          orderBy: {
            position: 'asc',
          },
          include: {
            tasks: {
              orderBy: {
                position: 'asc',
              }
            }
          }
        },
      },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
      });
      return project;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Project not foundа');
      }
      throw new InternalServerErrorException('Error updating project');      
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Project not foundа');
      }
      throw new InternalServerErrorException('Error deleting project');
    }
  }
}
