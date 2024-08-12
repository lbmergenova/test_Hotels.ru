import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async registration(createUserDto: CreateUserDto) {
      const user = await this.usersService.create(createUserDto);        
      const payload = { sub: user.id, username: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    async signIn(createUserDto: CreateUserDto):  Promise<{ access_token: string }>  {
      const user = await this.usersService.findOneByEmail(createUserDto.email);
      if (!user) {
        throw new HttpException('User with this email not found', HttpStatus.BAD_REQUEST);
      }
      const passwordEquals = await bcrypt.compare(createUserDto.password, user?.password);
      if (passwordEquals) {
        throw new UnauthorizedException({message: 'User is not authorized'});
      }
      const payload = { sub: user.id, username: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
}
