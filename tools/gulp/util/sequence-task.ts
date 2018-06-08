/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
// This import does not have any type definitions.
const gulpRunSequence = require('run-sequence');

gulpRunSequence.options.ignoreUndefinedTasks = true;

/** Create a task that's a sequence of other tasks. */
export function sequenceTask(...args: any[]) {
  return (done: any) => {
    gulpRunSequence(
      ...args,
      done,
    );
  };
}
