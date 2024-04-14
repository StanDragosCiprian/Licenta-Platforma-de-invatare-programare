import { ICompilatorUser } from '../Entity/ICompilatorUser';

import { CppCompier, ICppCompier } from './CppCompiler';
import { IJavaCompier, JavaCompier } from './JavaCompiler';
import { IJavaScriptCompier, JavaScriptCompier } from './JavaScriptCompiler';
import { IPythonCompier, PythonCompier } from './PythonCompiler';

export interface IHandleProgrammingLanguage {
  chooseLanguage(): Promise<string>;
  executeScripts(): Promise<unknown>;
  setInputOutputs(input: string): void;
}
export class HandleProgrammingLanguage implements IHandleProgrammingLanguage {
  private userData: ICompilatorUser;
  public constructor(userData) {
    this.userData = userData;
  }

  private input;

  setInputOutputs(input: string): void {
    this.input = input;
  }
  public async chooseLanguage() {
    let programs: IPythonCompier;
    switch (this.userData.programmingLanguage) {
      case 'python':
        programs = new PythonCompier();
        programs.setPatern(
          this.userData.functionName,
          this.userData.parameterWithType,
        );

        programs.generatePythonFuntion();
        return programs.getScripts();
      case 'cpp':
        programs = new CppCompier();
        programs.setPatern(
          this.userData.functionName,
          this.userData.parameterWithType,
        );

        programs.generatePythonFuntion();
        return programs.getScripts();
      case 'javaScript':
        programs = new JavaScriptCompier();
        programs.setPatern(
          this.userData.functionName,
          this.userData.parameterWithType,
        );

        programs.generatePythonFuntion();
        return programs.getScripts();
      case 'java':
        programs = new JavaCompier();
        programs.setPatern(
          this.userData.functionName,
          this.userData.parameterWithType,
        );

        programs.generatePythonFuntion();
        return programs.getScripts();
    }
  }
  public async executeScripts(): Promise<unknown> {
    let programs:
      | IPythonCompier
      | ICppCompier
      | IJavaScriptCompier
      | IJavaCompier;
    switch (this.userData.programmingLanguage) {
      case 'python':
        programs = new PythonCompier();
        programs.setPatern(
          this.userData.functionName,
          this.userData.parameterWithType,
        );
        programs.setInputOutputs(this.input);
        programs.setScripts(this.userData.scripts);
        return programs.execute();
      case 'cpp':
        programs = new CppCompier();
        programs.setPatern(
          this.userData.functionName,
          this.userData.parameterWithType,
        );
        programs.setInputOutputs(this.input);
        programs.setScripts(this.userData.scripts);
        return programs.execute();
      case 'javaScript':
        programs = new JavaScriptCompier();
        programs.setPatern(
          this.userData.functionName,
          this.userData.parameterWithType,
        );
        programs.setInputOutputs(this.input);
        programs.setScripts(this.userData.scripts);
        return programs.execute();
      case 'java':
        programs = new JavaCompier();
        programs.setPatern(
          this.userData.functionName,
          this.userData.parameterWithType,
        );
        programs.setInputOutputs(this.input);
        programs.setScripts(this.userData.scripts);
        return programs.execute();
    }
  }
}
