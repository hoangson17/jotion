import { Body, Controller, Get, Param, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Request() req:Request) {
    const id = req['user'].id;
    return this.usersService.findOne(id);
  }

  @Post()
  createUser(@Body() body:CreateUserDto){
    return this.usersService.createUser(body);
  }


}
