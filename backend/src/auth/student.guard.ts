import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CookieGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookieValue = request.cookies['id'];
    try {
      const decodedToken = this.jwtService.verify(cookieValue);
      if (decodedToken.role === 'student') {
        return true;
      }
    } catch (error) {
      console.error(error);
    }

    return false;
  }
}
