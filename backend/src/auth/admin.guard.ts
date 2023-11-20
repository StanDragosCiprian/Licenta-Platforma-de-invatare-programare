import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from 'src/Schemas/Use-case/admins/admins.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly studentService: AdminsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const id = request.cookies['id'];
      const decodedToken = this.jwtService.verify(id);
      const admin = await this.studentService.getAdmin(decodedToken.sub);
      if (admin?.role === 'admin' && admin.role !== null) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }
}
