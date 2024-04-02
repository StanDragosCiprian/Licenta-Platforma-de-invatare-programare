import { Controller, UseGuards } from '@nestjs/common';
import { Body, Get, Param, Post } from '@nestjs/common';
import { Cookies } from 'src/Cookie/cookie';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { CompilatorService } from './compilator.service';
import { ICompilatorUser } from 'src/Schemas/Entity/ICompilatorUser';
import { Types } from 'mongoose';
import { ProfessorGuard } from 'src/auth/professor.guard';
@Controller('/courses/compilator')
export class CompilatorController {
  constructor(private compilatorService: CompilatorService) {}
  @Get('/coursesProfessor/:courseName/compile')
  async coursesProfessorCompile(
    @Cookies('id') id: string,
    @Param('courseName') courseName: string,
  ) {
    const compilator: string[] =
      await this.compilatorService.getProfessorCompilator(id, courseName);
    return compilator;
  }
  @Post('/coursesProfessor/:courseName/Update/compile')
  async coursesProfessorUpdateCompile(
    @Cookies('id') id: string,
    @Param('courseName') courseName: string,
    @Body() body: ICompilators & { oldTitle: string },
  ) {
    await this.compilatorService.updateCompilatorFromCourse(
      body,
      id,
      courseName,
    );
  }

  @Get('/:professor/:coursName/:language/:id/compile')
  async chooseCompilerEndPoint(
    @Param('language') language: string,
    @Param('id') id: string,
    @Param('professor') professor: string,
    @Param('coursName') coursName: string,
  ): Promise<string> {
    const curs: ICompilators =
      await this.compilatorService.getCoursFromProfessor(
        professor,
        coursName,
        id,
      );

    const choose = await this.compilatorService.chooseCompiler(
      this.makeCompilerDto(curs, language, ''),
    );
    return choose;
  }

  private makeCompilerDto(
    curs: ICompilators,
    language: string,
    scripts: string,
  ) {
    const test = curs.problemParameter.split(',');
    const j = {};

    test.forEach((t: string) => {
      const c = t.split('.');
      j[c[1]] = c[0];
    });
    const compilerDto: ICompilatorUser = {
      programmingLanguage: language,
      functionName: curs.funtionProblemModel,
      parameterWithType: JSON.parse(JSON.stringify(j)),
      scripts: scripts,
    };
    return compilerDto;
  }
  @Post('/:professor/:coursName/:language/:id/execute/script')
  async executeScripts(
    @Body() scripts: { script: string },
    @Param('language') language: string,
    @Param('id') id: string,
    @Param('professor') professor: string,
    @Param('coursName') coursName: string,
  ) {
    const curs: ICompilators =
      await this.compilatorService.getCoursFromProfessor(
        professor,
        coursName,
        id,
      );
    const output = this.takeParameterValue(curs.problemOutputs, 'Output');

    const inputs = this.takeParameterValue(curs.problemInputs, 'Input');
    for (let index = 0; index < inputs.length; index++) {
      const input = inputs[index];
      const exec = await this.compilatorService.executeScripts(
        this.makeCompilerDto(curs, language, scripts.script),
        input,
      );
      const e = exec.toString().replace('\r\n', '');
      if (e.replace('\n', '') !== output[index]) {
        return {
          isAlgorithmOk: false,
          input: input,
          yourOutput: e,
          expected: output[index],
        };
      }
    }

    return {
      isAlgorithmOk: true,
      input: '',
      yourOutput: '',
      expected: '',
    };
  }
  private takeParameterValue(input: string[], type: string): string[] {
    return input.map((item) => {
      return item.replace(`${type}(`, '').replace(')', '');
    });
  }
  @Post('/:coursName/new/exercices')
  @UseGuards(ProfessorGuard)
  async newExercies(
    @Body() exercices: ICompilators,
    @Param('coursName') coursName: string,
  ) {
    const cursId: Types.ObjectId =
      await this.compilatorService.takeCoursId(coursName);
    return await this.compilatorService.addMediaFormat(cursId, exercices);
  }
  @Get('/:professor/:coursName/:id/get/exercices/format')
  async getCompilerFormat(
    @Param('coursName') coursName: string,
    @Param('professor') professor: string,
    @Param('id') id: string,
  ) {
    const curs: ICompilators =
      await this.compilatorService.getCoursFromProfessor(
        professor,
        coursName,
        id,
      );
    return {
      title: curs.title,
      problemRequire: curs.problemRequire,
      problemExemples: curs.problemExemples,
      format: curs.format,
    };
  }
}
