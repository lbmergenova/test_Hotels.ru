import { ApiProperty } from "@nestjs/swagger";

export class Task {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
    id: number;

    @ApiProperty({ example: 'Задача 1', description: 'Заголовок задачи' })
    title: string;
  
    @ApiProperty({ example: 'Срочная задача', description: 'Описание задачи', required: false })
    description?: string;

    @ApiProperty({ description: 'Дата создания проекта' })
    createdAt: Date;
  
    @ApiProperty({ example: '1', description: 'Положение задачи в списке' })
    position: number;
  
    @ApiProperty({ example: '1', description: 'Id столбца, к которому относится задача' })
    columnId: number;
}
