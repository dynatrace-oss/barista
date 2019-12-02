import { JsonAstObject, JsonValue } from '@angular-devkit/core';
import { UpdateRecorder } from '@angular-devkit/schematics';
import { buildIndent } from './build-indent';

export function appendPropertyInJsonAst(
  recorder: UpdateRecorder,
  node: JsonAstObject,
  propertyName: string,
  value: JsonValue,
  indent: number,
): void {
  const indentStr = buildIndent(indent);

  if (node.properties.length > 0) {
    // Insert comma.
    const last = node.properties[node.properties.length - 1];
    recorder.insertRight(
      last.start.offset + last.text.replace(/\s+$/, '').length,
      ',',
    );
  }

  recorder.insertLeft(
    node.end.offset - 1,
    '  ' +
      `"${propertyName}": ${JSON.stringify(value, null, 2).replace(
        /\n/g,
        indentStr,
      )}` +
      indentStr.slice(0, -2),
  );
}
