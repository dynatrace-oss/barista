import * as Q from 'q';
import parserOpts from './parser-opts';
import writerOpts from './writer-opts';

export default Q.all([parserOpts, writerOpts])
  // Do not rename the params, conventional-changelog does need these exact names
  // tslint:disable:no-shadowed-variable
  .spread((parserOpts, writerOpts) => ({ parserOpts, writerOpts }));
