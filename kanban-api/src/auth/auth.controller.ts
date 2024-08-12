import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status:200, type: 'access_token'})
    @HttpCode(HttpStatus.OK)
    @Post('registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto)
    }

    @ApiOperation({summary: 'Aвторизация пользователя'})
    @ApiResponse({status:200, type: 'access_token'})
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: CreateUserDto) {
      return this.authService.signIn(signInDto);
    }
}
