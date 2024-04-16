import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfessorService } from 'src/Schemas/Use-case/professor/professor.service';

@Injectable()
export class ProfessorGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly professorService: ProfessorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const id = 'id' ? request.cookies?.['id'] : request.cookies;
      const decodedToken = this.jwtService.verify(id);
      const professor = await this.professorService.getProfessor(
        decodedToken.sub,
      );
      if (professor?.role === 'professor' && professor.role !== null) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new NotFoundException('Unauthorized access');
    }
  }
}
