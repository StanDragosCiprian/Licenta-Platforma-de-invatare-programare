import { Body, Controller, Post, Get, UseInterceptors } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { ErrorInterceptor } from '../ErrorInterceptor';
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { LogDto } from 'src/Schemas/DTO/log.dto';
import { JwtService } from '@nestjs/jwt';
import { Cookies } from 'src/Cookie/cookie';
@Controller('professor')
export class ProfessorController {
  constructor(
    private readonly professorService: ProfessorService,
    private jwtService: JwtService,
  ) {}
  private resp = new ResponseStatus();
  @Post('/new')
  @UseInterceptors(ErrorInterceptor)
  async createStudent(
    @Body() createProfessorDto: ProfessorDto,
  ): Promise<{ access_token: string }> {
    const newProfessor =
      await this.professorService.createProfessor(createProfessorDto);
    console.log(newProfessor);
    const payload = { sub: newProfessor._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  @Post('/log')
  @UseInterceptors(ErrorInterceptor)
  async logProfessor(@Body() log: LogDto): Promise<{ access_token: string }> {
    console.log(log);
    const user = await this.professorService.logUser(log.email, log.password);
    console.log(user);
    const payload = { sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  @Get('/get')
  @UseInterceptors(ErrorInterceptor)
  async getProfessor(@Cookies('id') id: string): Promise<any> {
    const decodedToken = this.jwtService.verify(id);
    const professor = this.professorService.getProfessor(decodedToken.sub);
    if (professor === undefined) {
      return 'No_Professor';
    }
    return professor;
  }
}
