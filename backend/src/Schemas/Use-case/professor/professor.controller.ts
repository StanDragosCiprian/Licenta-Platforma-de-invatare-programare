import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { ErrorInterceptor } from '../ErrorInterceptor';
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { LogDto } from 'src/Schemas/DTO/log.dto';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
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
  @Get('get/:id')
  @UseInterceptors(ErrorInterceptor)
  async getStudent(@Param('id') id: string): Promise<IProfessor> {
    const professor = this.professorService.getProfessor(id);
    return professor;
  }
}
