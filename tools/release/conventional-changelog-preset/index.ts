import * as Q from 'q';
import parserOpts from './parser-opts';
import writerOpts from './writer-opts';
import conventionalChangelog from './conventional-changelog';
import recommendedBumpOpts from './conventional-recommended-bump';

export default Q.all([conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts])
  // Do not rename the params, conventional-changelog does need these exact names
  // tslint:disable:no-shadowed-variable
  .spread((conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts) =>
    ({ conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts }));
