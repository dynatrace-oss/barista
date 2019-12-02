import { Tree } from '@angular-devkit/schematics';

/**
 * This method reads a file from a host tree
 * @param host The host tree
 * @param path The path to the file
 */
export function readFromTree(host: Tree, path: string): string {
  if (!host.exists(path)) {
    throw new Error(`Cannot find ${path}`);
  }
  return host.read(path)!.toString('utf-8');
}

/**
 * This method is specifically for reading JSON files in a Tree
 * @param host The host tree
 * @param path The path to the JSON file
 * @returns The JSON data in the file.
 */
export function readJsonInTree<T = any>(host: Tree, path: string): T {
  const content = readFromTree(host, path);
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`Cannot parse ${path}: ${e.message}`);
  }
}
