import { Body, Get, Post } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { Cookies } from 'src/Cookie/cookie';
import { LogDto } from 'src/Schemas/DTO/log.dto';
import { StudentDto } from 'src/Schemas/DTO/student.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailAlreadyExistsException } from '../ErrorInterceptor';
import { ProfessorService } from '../professor/professor.service';
export abstract class UserController {
  abstract user: StudentService | ProfessorService;
  abstract jwt: JwtService;
  @Post('/new')
  async createUser(
    @Body() createStudentDto: StudentDto | ProfessorService,
  ): Promise<{ access_token: string }> {
    try {
      const newUser = await this.user.createUser(createStudentDto);
      const payload = { sub: newUser._id };
      return {
        access_token: await this.jwt.signAsync(payload),
      };
    } catch (e) {
      throw new EmailAlreadyExistsException();
    }
  }
  @Post('/log')
  async logUser(@Body() log: LogDto): Promise<{ access_token: string }> {
    try {
      const logUser = await this.user.logUser(log.email, log.password);
      return this.user.makeJwt(logUser);
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
  @Get('get')
  async getUser(@Cookies('id') id: string): Promise<any> {
    try {
      const decodedToken = await this.user.decriptJwt(id);
      const user = await this.user.getUserById(decodedToken);
      if (user === null) {
        return ' ';
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
}
