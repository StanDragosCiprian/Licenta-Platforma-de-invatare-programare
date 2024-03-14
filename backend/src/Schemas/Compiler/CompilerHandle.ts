import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { writeFileSync } from 'fs';

export interface ICompilerHandler {
  executePythonCode: () => Promise<unknown>;
  executeCppCode: () => Promise<unknown>;
  executeCCode: () => Promise<unknown>;
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
        if (compileExitStatus != 0) {
          return;
        }

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
          }
        });
      });
    });
  };
  public executeCCode = async () => {
    writeFileSync(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Compiler\\CFile.c',
      this.script,
    );
    return new Promise((resolve, reject) => {
      const compile = spawn('gcc', [
        '-o',
        'output',
        'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Compiler\\CFile.c',
      ]);
      let result = '';

      compile.on('close', (compileExitStatus) => {
        if (compileExitStatus != 0) {
          console.log(`GCC exited with status ${compileExitStatus}`);
          reject(new Error('GCC compilation failed'));
          return;
        }

        const run = spawn('./output');

        run.stdout.on('data', (data) => {
          result += `${data}`;
          console.log('result: ', result);
          resolve(result);
        });

        run.stderr.on('data', (data) => {
          console.log(`Error: ${data}`);
          result += `${data}`;
          console.log('result: ', result);
          resolve(result);
        });

        run.on('close', (runExitStatus) => {
          if (runExitStatus != 0) {
            console.log(`Program exited with status ${runExitStatus}`);
          }
        });
      });
    });
  };
  public executeJavaCode = async () => {
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
        console.log(`stdout: ${data}`);
      });

      child.stderr.on('data', (data) => {
        result += data;
        console.error(`stderr: ${data}`);
      });

      child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
          // If the compilation was successful, run the program
          const run = spawn('java', [
            '-cp',
            'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Compiler',
            'JavaFile', // Notice: no .java extension
          ]);

          run.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            resolve(data);
          });

          run.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            resolve(data);
          });

          run.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
          });
        }
      });
    });
  };

  public executeJavaScriptCode = async () => {
    writeFileSync(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Compiler\\JavaScripFile.js',
      this.script,
    );
    return new Promise((resolve) => {
      let result = '';
      const child = spawn('node', [
        'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Compiler\\JavaScripFile.js',
      ]);

      child.stdout.on('data', (data) => {
        result += data;
        console.log(`stdout: ${data}`);
        resolve(result);
      });

      child.stderr.on('data', (data) => {
        result += data;
        console.error(`stderr: ${data}`);
        resolve(result);
      });

      child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
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

      this.process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        resolve(result);
      });
    });
  };
}
