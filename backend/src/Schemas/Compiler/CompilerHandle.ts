import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';
import { writeFileSync } from 'fs';

export interface ICompilerHandler {
  executePythonCode: () => Promise<unknown>;
  executeCppCode: () => Promise<unknown>;
  executeJavaScriptCode: () => Promise<unknown>;
  executeJavaCode: () => Promise<unknown>;
}
export class CompilerHandler {
  private programingLanguage: string;
  private process: ChildProcessWithoutNullStreams;
  private script: string;
  public constructor(programingLanguage: string, script: string) {
    this.programingLanguage = programingLanguage;
    this.script = script;
  }

  public executeCppCode = async () => {
    writeFileSync(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Compiler\\CppFile.cpp',
      this.script,
    );
    return new Promise((resolve) => {
      const compile = spawn('g++', [
        '-o',
        'output',
        'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Compiler\\CppFile.cpp',
      ]);
      let result = '';
      compile.on('close', (compileExitStatus) => {
        const run = spawn('./output');
        run.stdout.on('data', (data) => {
          result += `${data}`;
          resolve(result);
        });

        run.stderr.on('data', (data) => {
          result += `${data}`;
          resolve(result);
        });
        run.on('close', (runExitStatus) => {
          if (runExitStatus != 0) {
            resolve(result);
          }
        });
        if (compileExitStatus != 0) {
          resolve(result);
          return;
        }
      });
    });
  };
  public executeJavaCode = async () => {
    this.script = this.script.replace(/string/g, 'String');
    writeFileSync(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Compiler\\JavaFile.java',
      this.script,
    );
    return new Promise((resolve) => {
      const child = spawn('javac', [
        'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Compiler\\JavaFile.java',
      ]);
      let result = '';
      child.stdout.on('data', (data) => {
        result += data;
        resolve(1);
      });

      child.stderr.on('data', (data) => {
        result += data;

        resolve(
          result.replace(
            'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Compiler\\JavaFile.',
            ' ',
          ),
        );
      });

      child.on('close', (code) => {
        if (code === 0) {
          const run = spawn('java', [
            '-cp',
            'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Compiler',
            'JavaFile',
          ]);

          run.stdout.on('data', (data) => {
            resolve(data);
          });

          run.stderr.on('data', (data) => {
            resolve(data);
          });
        } else {
          resolve('');
        }
      });
    });
  };

  public executeJavaScriptCode = async () => {
    return new Promise((resolve, reject) => {
      const command = `node -e "${this.script.replace(/\n/g, ' ')}"`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(`exec error: ${error}`);
          return;
        }

        if (stderr) {
          console.error(`stderr: ${stderr}`);
          reject(`stderr: ${stderr}`);
          return;
        }
        resolve(stdout);
      });
    });
  };

  public executePythonCode = async () => {
    return new Promise((resolve) => {
      let result = '';
      this.process = spawn(this.programingLanguage, ['-c', this.script]);

      this.process.stdout.on('data', (data) => {
        result += data.toString();
      });

      this.process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        result += `${data}`;
        resolve(data.toString());
      });

      this.process.on('close', () => {
        resolve(result);
      });
    });
  };
}
