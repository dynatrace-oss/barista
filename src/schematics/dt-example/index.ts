import { strings } from '@angular-devkit/core';
import {
  Rule,
  apply,
  mergeWith,
  move,
  template,
  url,
  SchematicsException,
} from '@angular-devkit/schematics';
import { DtExampleOptions } from './schema';

// tslint:disable-next-line:no-default-export
export default function(options: DtExampleOptions): Rule {
  if (!options.component) {
    throw new SchematicsException(`You need to specify a component using --component flag`);
  }
  options.component = strings.decamelize(options.component);
  options.name = strings.decamelize(options.name);
  options.exampleComponentName = `${strings.classify(options.component)}${strings.classify(options.name)}Example`;
  const templateSource = apply(url('./files'), [
    template({...strings, ...options}),
    move('src'),
  ]);

  return mergeWith(templateSource);
}
