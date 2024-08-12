import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnDto } from './create-column.dto';
import { IsNumber, IsOptional, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
    @ApiProperty({example: '1', description: 'Позиция в проекте'})
    @IsOptional()
    @IsNumber()
    @Min(1)
    position: number;
}
