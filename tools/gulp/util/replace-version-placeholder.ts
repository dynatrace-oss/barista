import { readFileSync, writeFileSync } from 'fs';
import { buildConfig } from '../build-config';
import { join } from 'path';

const SPACES_FOR_PACKAGE_JSON = 2;

/** RegExp that matches Angular version placeholders within a file. */
const ngVersionPlaceholder = new RegExp('0.0.0-NG', 'g');

const readPackageJson = (dirPath: string) =>
  readFileSync(join(dirPath, 'package.json'), 'utf-8');

export const replaceVersionPlaceholders = () => {
  /* read the package json in the dist directory for the library
    and replace the NG-version placeholder */
  const packageJson = readPackageJson(buildConfig.libOutputDir)
    .replace(ngVersionPlaceholder, buildConfig.angularVersion);
  /* read root package json in the projects root dir */
  const rootPackageJson = readPackageJson(buildConfig.projectDir);
  /* parse it as json */
  const rootPackageJsonParsed = JSON.parse(rootPackageJson);
  /* parse the package json and add the version from the root package json */
  const parsed = JSON.parse(packageJson);
  parsed.version = rootPackageJsonParsed.version;
  /* write file to the dist folder */
  writeFileSync(join(buildConfig.libOutputDir, 'package.json'), JSON.stringify(parsed, null, SPACES_FOR_PACKAGE_JSON));
};
