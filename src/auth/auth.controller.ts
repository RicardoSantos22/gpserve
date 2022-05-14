import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { User } from '../entities/user/model/user.model';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('user/login')
    async login(@Req() req: Request) {
        return this.authService.login(req.user as User)
    }
}
