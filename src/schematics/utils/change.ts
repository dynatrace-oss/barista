import { Tree } from '@angular-devkit/schematics';
import { isArray } from 'rxjs/internal-compatibility';

export interface Host {
  write(path: string, content: string): Promise<void>;
  read(path: string): Promise<string>;
}

export interface Change {
  apply(host: Host): Promise<void>;

  // The file this change should be applied to. Some changes might not apply to
  // a file (maybe the config).
  readonly path: string | null;

  // The order this change should be applied. Normally the position inside the file.
  // Changes are applied from the bottom of a file to the top.
  readonly order: number;

  // The description of this change. This will be outputted in a dry or verbose run.
  readonly description: string;
}

/**
 * Adds text to the source code.
 */
export class InsertChange implements Change {
  order: number;
  description: string;

  constructor(public path: string, public pos: number, public toAdd: string) {
    if (pos < 0) {
      throw new Error('Negative positions are invalid');
    }
    this.description = `Inserted ${toAdd} into position ${pos} of ${path}`;
    this.order = pos;
  }

  /**
   * This method does not insert spaces if there is none in the original string.
   */
  apply(host: Host): Promise<void> {
    return host.read(this.path).then(content => {
      const prefix = content.substring(0, this.pos);
      const suffix = content.substring(this.pos);

      return host.write(this.path, `${prefix}${this.toAdd}${suffix}`);
    });
  }
}

// /**
//  * Creates a new directory if it does not already exist.
//  */
// export class CreateDirectoryChange implements Change {
//   description: string;
//
//   constructor(public path: string, public order: number) {
//     if (order < 0) {
//       throw new Error('Negative order is invalid');
//     }
//     this.description = `Create directory ${path}`;
//   }
//
//   /**
//    * This method does not insert spaces if there is none in the original string.
//    */
//   apply(host: Host): Promise<void> {
//     return host.read(this.path).then(content => {
//       const prefix = content.substring(0, this.pos);
//       const suffix = content.substring(this.pos);
//
//       return host.write(this.path, `${prefix}${this.toAdd}${suffix}`);
//     });
//   }
// }

/**
 * Commit changes to host
 */
export function commitChanges(
  host: Tree,
  changes: Change | Change[],
  path: string,
): Tree {
  const recorder = host.beginUpdate(path);

  for (const change of isArray(changes) ? changes : [changes]) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(recorder);

  return host;
}
