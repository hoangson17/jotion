import { Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    @Post('/login')
    async login(@Body() body: any) {
        const attemp = await this.usersService.login(body);
        if(!attemp) throw new UnauthorizedException('Email hoac mat khau khong chinnh xac');
        return attemp;
    }
    
    @Post('/register')
    register(@Body() body: any) {
        
    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    profile(@Request() req: any) {
        return req.user;
    }

    @Post('/refresh-token')
    async refreshToken(@Body() body: any) {
        const result = await this.usersService.refreshToken(body);
        if(!result){
            throw new UnauthorizedException('Refresh token khong hop le');
        }
        return this.usersService.refreshToken(body);   
    }

    @UseGuards(AuthGuard)
    @Post('/logout')
    logout(@Request() req: any) {
        const {user} = req;
        const jti = user.jti;
        const exp = user.exp;
        return this.usersService.logout(jti,exp);
    }
}
