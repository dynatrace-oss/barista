import * as stream from 'stream';
import * as through from 'through2';

export const replaceInFile = (searchValue: string | RegExp, replaceValue?: string): stream.Transform =>
  through.obj((file, _, callback) => {
    if (file.isNull()) {
      callback(null);
      return;
    }

    if (replaceValue === undefined) {
      callback(null, file);
      return;
    }

    const contentStr = file.contents.toString('utf8');
    file.contents = Buffer.from(contentStr.replace(searchValue, replaceValue));

    callback(null, file);
  });
