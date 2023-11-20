import { Body, Controller, Post, Get, UseInterceptors } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { ErrorInterceptor } from '../ErrorInterceptor';
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { LogDto } from 'src/Schemas/DTO/log.dto';
import { Cookies } from 'src/Cookie/cookie';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}
  private resp = new ResponseStatus();
  @Post('/new')
  @UseInterceptors(ErrorInterceptor)
  async createStudent(
    @Body() createProfessorDto: ProfessorDto,
  ): Promise<{ access_token: string }> {
    const newProfessor =
      await this.professorService.createProfessor(createProfessorDto);
    return this.professorService.makeJwt(newProfessor._id);
  }
  @Post('/log')
  @UseInterceptors(ErrorInterceptor)
  async logProfessor(@Body() log: LogDto): Promise<{ access_token: string }> {
    const user = await this.professorService.logUser(log.email, log.password);
    return this.professorService.makeJwt(user);
  }
  @Get('/get')
  @UseInterceptors(ErrorInterceptor)
  async getProfessor(@Cookies('id') id: string): Promise<any> {
    const decodedToken = await this.professorService.decriptJwt(id);
    const professor = await this.professorService.getProfessor(decodedToken);

    if (professor === null) {
      return ' ';
    }
    return professor;
  }

  @Get('/isProfessor')
  async verifyAdmin(@Cookies('id') id: string): Promise<boolean> {
    const decodedToken = await this.professorService.decriptJwt(id);
    const professor = await this.professorService.getProfessor(decodedToken);

    if (professor === null) {
      return false;
    }
    return true;
  }
}
