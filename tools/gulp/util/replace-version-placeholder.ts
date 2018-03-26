import { readFileSync, writeFileSync } from 'fs';
import { buildConfig } from '../build-config';
import { join } from 'path';

/** RegExp that matches Angular version placeholders within a file. */
const ngVersionPlaceholder = new RegExp('0.0.0-NG', 'g');

export function replaceVersionPlaceholders() {
  /* read the package json in the dist directory for the library
    and replace the NG-version placeholder */
  const packageJson = readFileSync(join(buildConfig.libOutputDir, 'package.json'), 'utf-8')
    .replace(ngVersionPlaceholder, buildConfig.angularVersion);
  /* read root package json in the projects root dir */
  const rootPackageJson = readFileSync(join(buildConfig.projectDir, 'package.json'), 'utf-8');
  /* parse it as json */
  const rootPackageJsonParsed = JSON.parse(rootPackageJson);
  /* parse the package json and add the version from the root package json */
  const parsed = JSON.parse(packageJson);
  parsed.version = rootPackageJsonParsed.version;
  /* write file to the dist folder */
  writeFileSync(join(buildConfig.libOutputDir, 'package.json'), JSON.stringify(parsed, null, 2));
}
