import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { User } from '../entities/user/model/user.model';
import { DatabaseErrorDto } from 'src/common/models/dto/errors';

import { ApiOperation, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Req,
  UseGuards,
  Body,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @ApiOperation({
    summary: 'Login admin',
    description: 'Authenticates a FineroPay Business admin.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Database retrieve error',
    type: DatabaseErrorDto,
  })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  )
  @HttpCode(HttpStatus.OK)
  @Post('admin/login')
  loginAdmin(@Body() dto: any) {
    return this.authService.loginAdmin(dto);
  }
}
