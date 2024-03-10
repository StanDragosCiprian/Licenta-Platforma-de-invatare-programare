import { CompilerHandler, ICompilerHandler } from './CompilerHandle';
export interface IPythonCompier {
  execute(): Promise<unknown>;
  setPatern(funtionName: string, parameterWithType: JSON): void;
  setScripts(script: string): void;
  getScripts(): string;
  generatePythonFuntion(): void;
  setInputOutputs(input: string): void;
}
export class PythonCompier implements IPythonCompier {
  private programingLanguage: string = 'python';
  private funtionName: string;
  private parameterWithType: JSON;
  private script: string;
  private inputs: string;

  setInputOutputs(input: string): void {
    this.inputs = input;
  }
  public setPatern(funtionName: string, parameterWithType: JSON) {
    this.funtionName = funtionName;
    this.parameterWithType = parameterWithType;
  }
  public setScripts(script: string) {
    this.script = script;
  }
  getScripts(): string {
    return this.script;
  }
  public generatePythonFuntion() {
    const keys = Object.keys(this.parameterWithType);
    let stringKey: string = '';
    keys.forEach((k: string) => {
      stringKey += ',' + k;
    });
    console.log(stringKey);
    this.script = `def ${this.funtionName.split('.')[1]}(${stringKey.substring(
      1,
    )}):`;
  }

  public async execute() {
    const nameOfFunction = this.funtionName.split('.')[1].replace('def ', '');
    this.script += `\n\nprint(${nameOfFunction}(${this.inputs}))`;
    console.log('this.script: ', this.script);
    const compilerHandler: ICompilerHandler = new CompilerHandler(
      this.programingLanguage,
      this.script,
    );
    return compilerHandler.executeCode();
  }
}
