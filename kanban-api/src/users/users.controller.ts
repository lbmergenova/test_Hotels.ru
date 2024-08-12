import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './entities/user.entity';

@ApiTags('Пользователи')
@UseGuards(AuthGuard)
@Controller('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @ApiOperation({summary: 'Получение всех пользователей'})
  @ApiResponse({status: 201, type: [User]})
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({summary: 'Получение пользователя по id'})
  @ApiResponse({status: 200, type: User})
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({summary: 'Обновление пользователя'})
  @ApiResponse({status: 200, type: 'access_token'})
  @Patch(':id')
  update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({summary: 'Удаление пользователя'})
  @ApiResponse({status:204})
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    return this.usersService.remove(+id);
  }
}
