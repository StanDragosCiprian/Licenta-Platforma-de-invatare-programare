import { ICompilatorUser } from '../Entity/ICompilatorUser';
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
    }
  }
  public async executeScripts(): Promise<unknown> {
    let programs: IPythonCompier;
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
    }
  }
}
