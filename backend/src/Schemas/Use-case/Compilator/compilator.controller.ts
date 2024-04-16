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
    try {
      const compilator: string[] =
        await this.compilatorService.getProfessorCompilator(id, courseName);
      return compilator;
    } catch (error) {
      // Handle the exception here
      console.error(error);
      throw new Error(
        'An error occurred while fetching the professor compilator',
      );
    }
  }
  @Post('/coursesProfessor/:courseName/Update/compile')
  async coursesProfessorUpdateCompile(
    @Cookies('id') id: string,
    @Param('courseName') courseName: string,
    @Body() body: ICompilators & { oldTitle: string },
  ) {
    try {
      await this.compilatorService.updateCompilatorFromCourse(
        body,
        id,
        courseName,
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while updating the professor compilator',
      );
    }
  }

  @Get('/:professor/:courseName/:language/:id/compile')
  async chooseCompilerEndPoint(
    @Param('language') language: string,
    @Param('id') id: string,
    @Param('professor') professor: string,
    @Param('courseName') courseName: string,
  ): Promise<string> {
    try {
      const course: ICompilators =
        await this.compilatorService.getCoursFromProfessor(
          professor,
          courseName,
          id,
        );

      const choose = await this.compilatorService.chooseCompiler(
        this.makeCompilerDto(course, language, ''),
      );
      return choose;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while choosing the compiler');
    }
  }

  private makeCompilerDto(
    course: ICompilators,
    language: string,
    scripts: string,
  ) {
    const test = course.problemParameter.split(',');
    const j = {};

    test.forEach((t: string) => {
      const c = t.split('.');
      j[c[1]] = c[0];
    });
    const compilerDto: ICompilatorUser = {
      programmingLanguage: language,
      functionName: course.funtionProblemModel,
      parameterWithType: JSON.parse(JSON.stringify(j)),
      scripts: scripts,
    };
    return compilerDto;
  }
  @Post('/:professor/:courseName/:language/:id/execute/script')
  async executeScripts(
    @Body() scripts: { script: string },
    @Param('language') language: string,
    @Param('id') id: string,
    @Param('professor') professor: string,
    @Param('courseName') courseName: string,
  ) {
    try {
      const course: ICompilators =
        await this.compilatorService.getCoursFromProfessor(
          professor,
          courseName,
          id,
        );
      const output = this.takeParameterValue(course.problemOutputs, 'Output');

      const inputs = this.takeParameterValue(course.problemInputs, 'Input');
      for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];
        const exec = await this.compilatorService.executeScripts(
          this.makeCompilerDto(course, language, scripts.script),
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
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while executing the scripts');
    }
  }
  private takeParameterValue(input: string[], type: string): string[] {
    return input.map((item) => {
      return item.replace(`${type}(`, '').replace(')', '');
    });
  }
  @Post('/:courseName/new/exercices')
  @UseGuards(ProfessorGuard)
  async newExercies(
    @Body() exercices: ICompilators,
    @Param('courseName') courseName: string,
  ) {
    try {
      const courseId: Types.ObjectId =
        await this.compilatorService.takeCoursId(courseName);
      return await this.compilatorService.addMediaFormat(courseId, exercices);
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while adding new exercises');
    }
  }
  @Get('/:professor/:courseName/:id/get/exercices/format')
  async getCompilerFormat(
    @Param('courseName') courseName: string,
    @Param('professor') professor: string,
    @Param('id') id: string,
  ) {
    try {
      const course: ICompilators =
        await this.compilatorService.getCoursFromProfessor(
          professor,
          courseName,
          id,
        );
      return {
        title: course.title,
        problemRequire: course.problemRequire,
        problemExemples: course.problemExemples,
        format: course.format,
      };
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while getting the compiler format');
    }
  }
}
