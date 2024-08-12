import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateColumnDto {
    @ApiProperty({example: 'Колонка 1', description: 'Название колонки'})
    @Length(1, 50, {message: 'Не меньше 1 и не больше 50'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;
}
