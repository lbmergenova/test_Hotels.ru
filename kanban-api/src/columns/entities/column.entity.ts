import { ApiProperty } from "@nestjs/swagger";
// import { Project } from "src/projects/entities/project.entity";

export class Column {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
    id: number;
  
    @ApiProperty({ example: 'to do', description: 'Название столбца' })
    name: string;
  
    @ApiProperty({ example: '1', description: 'Id проекта, которому принадлежит столбец' })
    projectId: number;
  
    // @ApiProperty({ type: () => Project, description: 'The project that owns the column' })
    // project: Project;
}
