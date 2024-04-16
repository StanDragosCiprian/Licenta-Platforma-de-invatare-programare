import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/Schemas/Use-case/student/student.service';

@Injectable()
export class StudentGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const id = request.cookies['id'];
      const decodedToken = this.jwtService.verify(id);
      const student = await this.studentService.getStudent(decodedToken.sub);
      if (student?.role === 'student' && student.role !== null) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new NotFoundException('Unauthorized access');
    }
  }
}
