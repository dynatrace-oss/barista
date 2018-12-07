import * as Q from 'q';
import parserOpts from './parser-opts';
import writerOpts from './writer-opts';

export default Q.all([parserOpts, writerOpts])
  .spread((parserOptions, writerOptions) => ({ parserOptions, writerOptions }));
