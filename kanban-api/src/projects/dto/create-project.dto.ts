import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateProjectDto {
    @ApiProperty({example: 'Проект 1', description: 'Название проекта'})
    @Length(1, 50, {message: 'Не меньше 1 и не больше 50'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;

    @ApiProperty({example: 'Мой первый, важный проект', description: 'Описание проекта'})
    @IsString({message: 'Должно быть строкой'})
    @Length(0, 255, {message: 'Не больше 255'})
    readonly description: string;
}
