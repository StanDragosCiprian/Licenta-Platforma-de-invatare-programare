import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { ErrorInterceptor } from '../ErrorInterceptor';
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { LogDto } from 'src/Schemas/DTO/log.dto';
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
      await this.professorService.createProfessor(createProfessorDto);
    return this.resp.goodResponse(response, newProfessor);
  }
  @Post('/log')
  @UseInterceptors(ErrorInterceptor)
  async logProfessor(@Body() log: LogDto) {
    const logProfessor = this.professorService.logUser(log.email, log.password);
    return logProfessor;
  }
}
