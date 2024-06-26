import { CompilerHandler, ICompilerHandler } from './CompilerHandle';
export interface IJavaCompier {
  execute(): Promise<unknown>;
  setPatern(funtionName: string, parameterWithType: JSON): void;
  setScripts(script: string): void;
  getScripts(): string;
  generatePythonFuntion(): void;
  setInputOutputs(input: string): void;
}
export class JavaCompier implements IJavaCompier {
  private programingLanguage: string = 'java';
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
    this.script = `public class JavaFile {\n
   static ${funtionForms[0]} ${funtionForms[1]}(${stringKey.substring(1)}){\n\n}
    public static void main(String[] args) {
    }
}`;
    this.script = this.script.replace(/string/g, 'String');
  }
  private makeJavaArray() {
    const value = Object.values(this.parameterWithType);
    for (const [index, v] of value.entries()) {
      if (v.search('[]') === -1) {
        if (!this.inputs.includes('],[')) {
          this.inputs = this.inputs.replace('[', '{');
          this.inputs = this.inputs.replace(']', '}');
          this.inputs = 'new ' + v + this.inputs;
        } else {
          const arr = this.inputs.split(/(?<=]),(?=\[)/);
          let newString = '';
          for (let a of arr) {
            a = a.replace('[', '{');
            a = a.replace(']', '}');
            newString += 'new ' + value[index] + a + ',';
          }
          this.inputs = newString.substring(0, newString.length - 1);
          break;
        }
      }
    }
  }
  public async execute() {
    this.makeJavaArray();
    const nameOfFunction = this.funtionName.split('.')[1];
    this.script = this.script.replace(
      'public static void main(String[] args) {',
      `public static void main(String[] args) {\nSystem.out.println(${nameOfFunction}(${this.inputs}));`,
    );
    const compilerHandler: ICompilerHandler = new CompilerHandler(
      this.programingLanguage,
      this.script,
    );
    const test = await compilerHandler.executeJavaCode();
    return test;
  }
}
