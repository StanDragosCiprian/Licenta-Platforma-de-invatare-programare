import { CompilerHandler, ICompilerHandler } from './CompilerHandle';
export interface ICppCompier {
  execute(): Promise<unknown>;
  setPatern(funtionName: string, parameterWithType: JSON): void;
  setScripts(script: string): void;
  getScripts(): string;
  generatePythonFuntion(): void;
  setInputOutputs(input: string): void;
}
export class CppCompier implements ICppCompier {
  private programingLanguage: string = 'g++';
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
    const value = Object.values(this.parameterWithType);
    let stringKey: string = '';
    keys.forEach((k: string, index: number) => {
      stringKey += ',' + `${value[index]}  ${k}`;
    });
    const funtionForms = this.funtionName.split('.');
    this.script = `#include <iostream>\nusing namespace std;\n
    ${funtionForms[0]} ${funtionForms[1]}(${stringKey.substring(1)}){\n\n}
    int main() {
        
        return 0;
    }`;
  }

  public async execute() {
    const nameOfFunction = this.funtionName.split('.')[1];
    this.script = this.script.replace(
      'int main() {',
      `int main() {\n\cout<<${nameOfFunction}(${this.inputs})<<endl;`,
    );
    const compilerHandler: ICompilerHandler = new CompilerHandler(
      this.programingLanguage,
      this.script,
    );

    return await compilerHandler.executeCppCode();
  }
}
