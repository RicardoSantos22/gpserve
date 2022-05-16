import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    private readonly logger = new Logger('JwtAuthGuard');

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {
        // this.logger.debug({err})
        // this.logger.debug({user})
        // this.logger.debug({info})
        if(info && info.name === 'TokenExpiredError') {
            throw new UnauthorizedException(info)
        }
        return user
    }

}
