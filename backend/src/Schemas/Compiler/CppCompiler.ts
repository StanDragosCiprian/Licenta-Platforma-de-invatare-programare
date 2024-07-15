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
    value.forEach((v, index) => {
      value[index] = v.replace('[]', '*');
    });
    let stringKey: string = '';
    keys.forEach((k: string, index: number) => {
      stringKey += ',' + `${value[index]}  ${k}`;
    });
    const funtionForms = this.funtionName.split('.');
    this.script = `#include <iostream>\n#include <string>\nusing namespace std;\n
    ${funtionForms[0]} ${funtionForms[1]}(${stringKey.substring(1)}){\n\n}
    int main() {
        
        return 0;
    }`;
  }
  private makeCArray() {
    const newValue = Object.values(this.parameterWithType);
    const regex = /\[\]/;
    for (const [index, v] of newValue.entries()) {
      if (regex.test(v)) {
        if (!this.inputs.includes('],[')) {
          this.inputs = this.inputs.replace('[', '{');
          this.inputs = this.inputs.replace(']', '}');
          this.inputs = this.inputs;
        } else {
          const arr = this.inputs.split(/(?<=]),(?=\[)/);
          let newString = '';
          for (let a of arr) {
            a = a.replace('[', '{');
            a = a.replace(']', '}');
            newString += 'new ' + newValue[index] + a + ',';
          }
          this.inputs = newString.substring(0, newString.length - 1);
          break;
        }
      }
    }
  }
  private transformStringToArray(): string[] {
    const pattern = /{[^{}]*}|\d+/g;
    const result = this.inputs.match(pattern);
    return result || [];
  }
  public async execute() {
    this.makeCArray();
    const nameOfFunction = this.funtionName.split('.')[1];
    const keys = Object.keys(this.parameterWithType);
    const value = Object.values(this.parameterWithType);
    let i = 0;
    let sc = '';
    const r = this.transformStringToArray();
    const isArry = [];
    for (const v of value) {
      if (v.includes('[]')) {
        r.forEach((str) => {
          if (str.includes('{')) {
            sc += `${v.replace('[]', ' ')}${keys[i]}[]=${str};\n`;
            isArry.push(keys[i]);
          } else {
            isArry.push(str);
          }
        });
        i++;
      }
    }
    if (isArry.length > 0) {
      this.inputs = '';
      isArry.forEach((str) => {
        this.inputs += `${str},`;
      });
      this.inputs = this.inputs.substring(0, this.inputs.length - 1);
    }
    this.script = this.script.replace(
      'int main() {',
      `int main() {${sc}\n\cout<<${nameOfFunction}(${this.inputs})<<endl;`,
    );
    const compilerHandler: ICompilerHandler = new CompilerHandler(
      this.programingLanguage,
      this.script,
    );

    return await compilerHandler.executeCppCode();
  }
}
