import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
export interface ICompilerHandler {
  executeCode: () => Promise<unknown>;
}
export class CompilerHandler {
  private programingLanguage: string;
  private process: ChildProcessWithoutNullStreams;
  private script: string;
  public constructor(programingLanguage: string, script: string) {
    this.programingLanguage = programingLanguage;
    this.script = script;
  }
  public executeCode = async () => {
    return new Promise((resolve, reject) => {
      let result = '';
      this.process = spawn(this.programingLanguage, ['-c', this.script]);

      this.process.stdout.on('data', (data) => {
        result += data.toString();
        console.log('result: ', result);
      });

      this.process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        result += `${data}`;
        resolve(data.toString());
      });

      this.process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        resolve(result);
      });
    });
  };
}
