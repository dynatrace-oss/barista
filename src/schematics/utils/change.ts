import { Tree } from '@angular-devkit/schematics';
import { isArray } from 'rxjs/internal-compatibility';

export interface Host {
  write(path: string, content: string): Promise<void>;
  read(path: string): Promise<string>;
}

export interface Change {
  apply(host: Host): Promise<void>;

  /**
   * The file this change should be applied to. Some changes might not apply to
   * a file (maybe the config).
   */
  readonly path: string | null;

  /**
   * The order this change should be applied. Normally the position inside
   * the file. Changes are applied from the bottom of a file to the top.
   */
  readonly order: number;

  /**
   * The description of this change. This will be outputted in a dry or
   * verbose run.
   */
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
   * This implementation does not insert spaces if there are none in the
   * original string.
   */
  async apply(host: Host): Promise<void> {
    const content = await host.read(this.path);
    const prefix = content.substring(0, this.pos);
    const suffix = content.substring(this.pos);

    return host.write(this.path, `${prefix}${this.toAdd}${suffix}`);
  }
}

/**
 * Commits changes to host.
 */
export function commitChanges(
  host: Tree,
  changes: InsertChange | InsertChange[],
  path: string,
): Tree {
  const recorder = host.beginUpdate(path);

  for (const change of isArray(changes) ? changes : [changes]) {
    recorder.insertLeft(change.pos, change.toAdd);
  }
  host.commitUpdate(recorder);

  return host;
}
