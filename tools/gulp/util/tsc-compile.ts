import { resolve as resolvePath } from 'path';
import { spawn } from 'child_process';
import { red } from 'chalk';

/**
 * Spawns a child process that compiles using tsc.
 * @param flags Command-line flags to be passed to tsc.
 * @returns Promise that resolves/rejects when the child process exits.
 */
export async function tscCompile(flags: string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const ngcPath = resolvePath('./node_modules/.bin/tsc');
    const childProcess = spawn(ngcPath, flags, {shell: true});

    // Pipe stdout and stderr from the child process.
    // tslint:disable-next-line:no-console
    childProcess.stdout.on('data', (data: string|Buffer) => { console.log(`${data}`); });
    // tslint:disable-next-line:no-console
    childProcess.stderr.on('data', (data: string|Buffer) => { console.error(red(`${data}`)); });
    childProcess.on('exit', (exitCode: number) => {
      if (exitCode === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}
