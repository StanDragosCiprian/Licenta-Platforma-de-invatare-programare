import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentDto } from '../../DTO/student.dto';
import { ErrorInterceptor } from '../ErrorInterceptor';
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { LogDto } from 'src/Schemas/DTO/log.dto';
import { JwtService } from '@nestjs/jwt';
import { Cookies } from 'src/Cookie/cookie';
@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private jwtService: JwtService,
  ) {}
  private resp = new ResponseStatus();
  @Post('/new')
  @UseInterceptors(ErrorInterceptor)
  async createStudent(
    @Body() createStudentDto: StudentDto,
  ): Promise<{ access_token: string }> {
    const newStudent =
      await this.studentService.createStudent(createStudentDto);
    console.log(newStudent);
    const payload = { sub: newStudent._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  @Post('/log')
  async logStudent(@Body() log: LogDto): Promise<{ access_token: string }> {
    const logStudent = await this.studentService.logUser(
      log.email,
      log.password,
    );
    if (logStudent !== null) {
      const payload = { sub: logStudent._id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    return {
      access_token: 'No_Student',
    };
  }
  @Get('get')
  @UseInterceptors(ErrorInterceptor)
  async getStudent(@Cookies('id') id: string): Promise<any> {
    const decodedToken = this.jwtService.verify(id);
    console.log(decodedToken);
    const student = await this.studentService.getStudent(decodedToken.sub);
    console.log(student);
    if (student === null) {
      return 'No_Student';
    }
    return student;
  }

  @Get('test')
  @UseInterceptors(ErrorInterceptor)
  async test(@Cookies('id') id: string): Promise<any> {
    const cookies = id;

    console.log(cookies);
    return 'cookies';
  }
}
