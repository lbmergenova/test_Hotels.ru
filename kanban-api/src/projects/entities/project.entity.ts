import { ApiProperty } from "@nestjs/swagger";
// import { Column } from "src/columns/entities/column.entity";
// import { User } from "src/users/entities/user.entity";

export class Project {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
    id: number;
  
    @ApiProperty({ example: 'Проект 1', description: 'Название проекта' })
    name: string;
  
    @ApiProperty({ example: 'Первый проект', description: 'Описание проекта' })
    description: string;
  
    @ApiProperty({ description: 'Дата создания проекта' })
    createdAt: Date;
  
    @ApiProperty({ example: '1', description: 'Id пользователя, которому принадлежит проект' })
    userId: number;
  
    // @ApiProperty({ type: () => User, description: 'The user who owns the project' })
    // user: User;
  
    // @ApiProperty({ type: () => [Column], description: 'List of columns in the project' })
    // columns: Column[];
}
