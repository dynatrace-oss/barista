import { strings } from '@angular-devkit/core';
import {
  apply,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  template,
  url,
} from '@angular-devkit/schematics';
import { DtExampleOptions } from './schema';

// tslint:disable-next-line:no-default-export
export default function(options: DtExampleOptions): Rule {
  if (!options.name) {
    throw new SchematicsException(
      `You need to specify a name using the --name flag`,
    );
  }
  if (!options.component) {
    throw new SchematicsException(
      `You need to specify a component using the --component flag`,
    );
  }

  const component = strings.dasherize(options.component);

  options.selector = component.startsWith('dt-')
    ? component
    : `dt-${component}`;

  return mergeWith(
    apply(url('./files'), [template({ ...strings, ...options }), move('src')]),
  );
}
