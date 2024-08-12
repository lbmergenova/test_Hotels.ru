import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({example: 'Задача 1', description: 'Заголовок задачи'})
    @Length(1, 50, {message: 'Не меньше 1 и не больше 50'})
    @IsString({message: 'Должно быть строкой'})
    readonly title: string;

    @IsOptional()
    @ApiProperty({example: 'Мой первый, важный проект', description: 'Описание проекта'})
    @IsString({message: 'Должно быть строкой'})
    @Length(0, 255, {message: 'Не больше 255'})
    readonly description?: string;

    @ApiProperty({example: '1', description: 'Id столбца, к которому относится задача'})
    @IsNumber()
    @Min(1)
    readonly columnId: number;
}
