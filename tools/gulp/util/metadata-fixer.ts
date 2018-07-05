import { readFile } from 'fs';
import * as stream from 'stream';
import { obj } from 'through2';

interface MetadataExport {
  from: string;
}

interface Metadata {
  exports: MetadataExport[];
}

export const fixMetadata = (fileWithExports: string): stream.Transform =>
  obj((file, _, callback) => {
    if (file.isNull()) {
      callback(null);
      return;
    }

    const metadata = JSON.parse(file.contents.toString('utf8')) as Metadata;

    readFile(fileWithExports, (err, content) => {
      if (err) {
        return callback(err);
      }

      const exportRegex = /export \* from '(.*)';/;

      metadata.exports = content.toString('utf8').split('\n')
        .map((l) => l.trim())
        .filter((l) => l.match(exportRegex))
        .map((l) => l.replace(exportRegex, '$1'))
        .map((l) => ({
          from: l,
        }));

      file.contents = Buffer.from(JSON.stringify(metadata));

      callback(null, file);
    });
  });
