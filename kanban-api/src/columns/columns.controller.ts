import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Column } from './entities/column.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthOwnerGuard } from 'src/auth/auth-owner.guard';
import { ColumnOwnershipGuard } from 'src/auth/column-ownership.guard';

@ApiTags('Столбцы')
@UseGuards(AuthOwnerGuard)
@UseGuards(AuthGuard)
@Controller('projects/:id/columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}
  
  @ApiOperation({summary:'Создание столба'})
  @ApiResponse({status: 201, type: Column})
  @Post()
  create(@Body() createColumnDto: CreateColumnDto, @Param('id') id: number) {
    return this.columnsService.create(createColumnDto, +id);
  }

  @ApiOperation({summary:'Получение всех столбцов проекта'})
  @ApiResponse({status: 200, type: [Column]})
  @Get()
  findAll(@Param('id') id: number) {
    return this.columnsService.findAll(+id);
  }

  @ApiOperation({summary:'Получение столбца по id для выбранного проекта'})
  @ApiResponse({status: 200, type: Column})
  @UseGuards(ColumnOwnershipGuard)
  @Get(':columnsId')
  findOne(@Param('columnsId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.columnsService.findOne(+id);
  }

  @ApiOperation({summary:'Обновление столбца по id для выбранного проекта'})
  @ApiResponse({status: 200, type: Column})
  @UseGuards(ColumnOwnershipGuard)
  @Patch(':columnsId')
  update(@Param('columnsId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) columnsId: number, @Body() updateColumnDto: UpdateColumnDto,
  @Param('id') projectId: number) {
    return this.columnsService.update(columnsId, updateColumnDto, projectId);
  }

  @ApiOperation({summary:'Удаление столбца по id для выбранного проекта'})
  @ApiResponse({status: 204})
  @UseGuards(ColumnOwnershipGuard)
  @Delete(':columnsId')
  remove(@Param('columnsId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.columnsService.remove(+id);
  }
}
