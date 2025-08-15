import { InjectRedis } from '@nestjs-modules/ioredis';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Observable } from 'rxjs';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: UsersService,
    @InjectRedis() private readonly redis: Redis
  ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requet = context.switchToHttp().getRequest();
    const token = requet.headers.authorization?.split(' ')[1];    
    const decode = this.authService.verifyToken(token);
    // console.log(decode);
    
    if(!decode){
      throw new UnauthorizedException('Token khong hop le');
    }
    //  check jwt blacklist
    const jti = decode.jti;
    const blacklist = await this.redis.get(`jwt_blacklist_${jti}`);
    if(blacklist){
      throw new UnauthorizedException('Unauthorized');
    }
    const user = await this.authService.profile(decode.userId);
    requet.user = user;
    requet.user.jti = jti;
    requet.user.exp = decode.exp;
    return true;
  }
}
