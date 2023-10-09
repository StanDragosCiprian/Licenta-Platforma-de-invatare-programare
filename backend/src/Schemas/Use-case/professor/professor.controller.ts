import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post('/new')
  async createProfessor(
    @Res() response,
    @Body() createProfessorDto: ProfessorDto,
  ) {
    try {
      const newProfessor =
        await this.professorService.createStudent(createProfessorDto);
      console.log(newProfessor);
      return response.status(HttpStatus.CREATED).json({
        message: 'Student has been created successfully',
        newStudent: newProfessor,
      });
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Student not created!',
        error: 'Bad Request',
      });
    }
  }
}
