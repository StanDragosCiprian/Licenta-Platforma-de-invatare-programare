import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
      const student = await this.professorService.getProfessor(
        decodedToken.sub,
      );
      if (student?.role === 'professor' && student.role !== null) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
