import { IsString, IsOptional, IsEmail, Length, min } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({example: 'user@email.com', description: 'Электронная почта'})
    @IsEmail({}, {message: 'Некорректный email'})
    readonly email: string;

    @ApiProperty({example: '123456', description: 'Пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(2, 12, {message: 'Не меньше 6 и не больше 16'})
    password: string;
}
