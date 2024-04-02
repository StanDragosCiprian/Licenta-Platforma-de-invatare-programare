import { CompilerHandler, ICompilerHandler } from './CompilerHandle';
export interface IJavaScriptCompier {
  execute(): Promise<unknown>;
  setPatern(funtionName: string, parameterWithType: JSON): void;
  setScripts(script: string): void;
  getScripts(): string;
  generatePythonFuntion(): void;
  setInputOutputs(input: string): void;
}
export class JavaScriptCompier implements IJavaScriptCompier {
  private programingLanguage: string = 'node';
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
      stringKey += ',' + `${k}`;
    });
    const funtionForms = this.funtionName.split('.');
    this.script = `function ${funtionForms[1]}(${stringKey.substring(
      1,
    )}){\n\n}`;
  }

  public async execute() {
    const nameOfFunction = this.funtionName.split('.')[1];
    this.script += `\nconsole.log(${nameOfFunction}(${this.inputs}))`;
    console.log('this.script: ', this.script);
    console.log(this.script);
    const compilerHandler: ICompilerHandler = new CompilerHandler(
      this.programingLanguage,
      this.script,
    );

    return await compilerHandler.executeJavaScriptCode();
  }
}
