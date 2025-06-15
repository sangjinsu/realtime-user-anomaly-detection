import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';
import {JwtAuthGuard} from "@utils/guards";
import {JwtRequest} from "../../../libs/utils/guards/src/jwt.request.type";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req: JwtRequest) {
        const user = req.user;
        return {
            id: user.sub,
            email: user.email,
            role: user.role,
        };
    }
}