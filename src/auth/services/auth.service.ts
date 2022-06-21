import { ERROR_FINDING_DOCUMENT } from 'src/common/models/errors/database.errors';
import { Admin } from 'src/entities/admin/model/admin.model';
import { User } from '../../entities/user/model/user.model';
import { UserService } from '../../entities/user/service/user.service';
import { AdminCredentialsDto } from '../dto/admin-credentials.dto';
import {ERROR_AUTHENTICATING_ENTITY, UNKNOWN_AUTH_ERROR} from 'src/common/models/errors/authentication.errors';

import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import * as jsonwebtoken from 'jsonwebtoken';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private usersService: UserService,
    private readonly configService: ConfigService,
    @InjectModel(Admin)
    private readonly adminModel: ReturnModelType<typeof Admin>,
  ) {}

  async validateUser(firebaseId: string, email: string) {
    const user = await this.usersService.findByEmailAndFirebaseId(
      firebaseId,
      email,
    );
    if (user) return user;
    return null;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user._id };
    return {
      accessToken: this.jwt.sign(payload),
    };
  }

  async loginAdmin(dto: AdminCredentialsDto): Promise<{ accessToken: string; account: Admin }> {
    const account = await this.validateAdminPassword(dto);
    const payload = {
      ...account,
      email: account.email || 'nelsonmlglez@gmail.com',
    };
    const accessToken = await jsonwebtoken.sign(
      payload,
      this.configService.get<string>('jwt.secret'),
      {
        expiresIn: this.configService.get<string>('jwt.expAdmin'),
      },
    );

    return {
      accessToken,
      account,
    };
  }

  private async validateAdminPassword(dto: AdminCredentialsDto): Promise<Admin> {
    try {
      const { email, password } = dto;
      const admin = await this.adminModel.findOne({ email });
      const isValidPassword = await compare(password, admin.password);
      
      if (!isValidPassword) {
        throw new UnauthorizedException(
          ERROR_AUTHENTICATING_ENTITY('Admin', 'Wrong credentials'),
        );
      }

      return (admin as any).toObject() as Admin;

    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      } else if (e instanceof NotFoundException) {
        throw new UnauthorizedException(ERROR_FINDING_DOCUMENT('Admin'));
      } else {
        throw new UnauthorizedException(UNKNOWN_AUTH_ERROR);
      }
    }
  }
}
