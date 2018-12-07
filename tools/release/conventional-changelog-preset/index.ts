import * as Q from 'q';
import parserOpts from './parser-opts';
import writerOpts from './writer-opts';
import conventionalChangelog from './conventional-changelog';
import recommendedBumpOpts from './conventional-recommended-bump';

export default Q.all([conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts])
  .spread((conventionalCL, parserOptions, recommendedBumpOptions, writerOptions) =>
    ({ conventionalCL, parserOptions, recommendedBumpOptions, writerOptions }));
