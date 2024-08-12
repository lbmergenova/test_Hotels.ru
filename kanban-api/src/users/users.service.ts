import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';


@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.findOneByEmail(createUserDto.email);
    if (user) {
      throw new HttpException('User with this email exists', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashPassword,
      }
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.email) {
        const candidate = await this.findOneByEmail(updateUserDto.email);
        if (!candidate) {
          throw new HttpException('User with this email not found', HttpStatus.BAD_REQUEST);
        }
        if (candidate && candidate.id !== id) {
            throw new HttpException('User with this email exists', HttpStatus.BAD_REQUEST);
        }
      }
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      const updateUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
  
      const payload = { sub: updateUser.id, username: updateUser.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('User not found')
      }
      throw new InternalServerErrorException('Error deleting user')
    }
  }
}
