import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';
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
    return new Promise((resolve, reject) => {
      const command = `echo '${this.script}' | g++ -x c++ - -mconsole -o myprogram ; ./myprogram`;
      const ps = spawn('powershell.exe', ['-Command', command]);

      let stdout = '';
      let stderr = '';

      ps.stdout.on('data', (data) => {
        stdout += data;
      });

      ps.stderr.on('data', (data) => {
        stderr += data;
      });

      ps.on('close', (code) => {
        if (code !== 0) {
          reject(`error: ${stderr}`);
        } else {
          resolve(`${stdout}`);
        }
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

        console.log(`${stdout}`);
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

      this.process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        resolve(result);
      });
    });
  };
}
