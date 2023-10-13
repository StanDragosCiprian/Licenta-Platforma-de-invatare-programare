import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { ErrorInterceptor } from '../Excetion';
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}
  private resp = new ResponseStatus();
  @Post('/new')
  @UseInterceptors(ErrorInterceptor)
  async createProfessor(
    @Res() response,
    @Body() createProfessorDto: ProfessorDto,
  ) {
    const newProfessor =
      await this.professorService.createStudent(createProfessorDto);
    return this.resp.goodResponse(response, newProfessor);
  }
}
