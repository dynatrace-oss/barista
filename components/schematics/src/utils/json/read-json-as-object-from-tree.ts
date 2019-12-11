import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { readFileFromTree } from '../read-file-from-tree';

/**
 * This method is specifically for reading JSON files in a Tree
 * @param host The host tree
 * @param path The path to the JSON file
 * @returns The JSON data in the file.
 */
export function readJsonAsObjectFromTree<T = any>(host: Tree, path: string): T {
  const content = readFileFromTree(host, path);
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`Cannot parse ${path}: ${e.message}`);
  }
}
