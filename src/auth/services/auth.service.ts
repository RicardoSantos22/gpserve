import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user/model/user.model';
import { UserService } from '../../entities/user/service/user.service';

@Injectable()
export class AuthService {

    constructor(private usersService: UserService, private jwt: JwtService) {}

    async validateUser(firebaseId: string, email: string) {
        const user = await this.usersService.findByEmailAndFirebaseId(firebaseId, email)
        if(user) return user
        return null
    }

    async login(user: User) {
        const payload = { username: user.email, sub: user._id };
        return {
          accessToken: this.jwt.sign(payload),
        };
    }

}
