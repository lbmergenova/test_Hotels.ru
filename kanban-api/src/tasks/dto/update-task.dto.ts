import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiProperty({example: '1', description: 'Позиция в проекте'})
    @IsOptional()
    @IsNumber()
    position: number;

    @ApiProperty({example: '1', description: 'Id колонки'})
    @IsOptional()
    @IsNumber()
    columnId: number;
}
