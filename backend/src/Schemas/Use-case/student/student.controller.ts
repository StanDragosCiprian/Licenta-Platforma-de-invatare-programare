import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentDto } from '../../DTO/student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @Post('/new')
  async createStudent(@Res() response, @Body() createStudentDto: StudentDto) {
    try {
      const newStudent =
        await this.studentService.createStudent(createStudentDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Student has been created successfully',
        newStudent,
      });
    } catch (err) {
      console.log(err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Student not created!',
        error: 'Bad Request',
      });
    }
  }
}
