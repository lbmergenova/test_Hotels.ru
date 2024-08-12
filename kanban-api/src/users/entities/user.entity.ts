import { ApiProperty } from "@nestjs/swagger";
// import { Project } from "src/projects/entities/project.entity";

export class User {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    id: number;

    @ApiProperty({example: 'user@email.com', description: 'Электронная почта'})
    email: string;
    
    @ApiProperty({example: '123456', description: 'Пароль'})
    password: string;

    // @ApiProperty({ type: () => [Project], description: 'List of projects owned by the user' })
    // projects: Project[];
}
