import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentDto } from '../../DTO/student.dto';
import { ErrorInterceptor } from '../ErrorInterceptor';
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { LogDto } from 'src/Schemas/DTO/log.dto';
import { IStudent } from 'src/Schemas/Entity/IStudent';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  private resp = new ResponseStatus();
  @Post('/new')
  @UseInterceptors(ErrorInterceptor)
  async createStudent(@Res() response, @Body() createStudentDto: StudentDto) {
    const newStudent =
      await this.studentService.createStudent(createStudentDto);
    return this.resp.goodResponse(response, newStudent);
  }
  @Post('/log')
  async logStudent(@Body() log: LogDto): Promise<string> {
    const logStudent = this.studentService.logUser(log.email, log.password);
    return logStudent;
  }
  @Get('get/:id')
  @UseInterceptors(ErrorInterceptor)
  async getStudent(@Param('id') id: string): Promise<IStudent> {
    const student = this.studentService.getStudent(id);
    return student;
  }
}
