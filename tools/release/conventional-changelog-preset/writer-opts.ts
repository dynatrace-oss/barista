import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as Q from 'q';
import * as compareFunc from 'compare-func';

export default Q.all([
  readFileSync(resolve(__dirname, './templates/template.hbs'), { encoding: 'utf-8' }),
  readFileSync(resolve(__dirname, './templates/header.hbs'), { encoding: 'utf-8' }),
  readFileSync(resolve(__dirname, './templates/commit.hbs'), { encoding: 'utf-8' }),
  readFileSync(resolve(__dirname, './templates/footer.hbs'), { encoding: 'utf-8' }),
]).spread((template, header, commit, footer) => {
  const writerOpts = getWriterOpts() as any;

  writerOpts.mainTemplate = template;
  writerOpts.headerPartial = header;
  writerOpts.commitPartial = commit;
  writerOpts.footerPartial = footer;

  return writerOpts;
});

function getWriterOpts() {
  return {
    transform: (commit) => {
      let discard = true;
      const issues = [];

      commit.notes.forEach((note) => {
        note.title = 'BREAKING CHANGES';
        discard = false;
      });

      if (commit.type === 'feat') {
        commit.type = 'Features';
      } else if (commit.type === 'fix') {
        commit.type = 'Bug Fixes';
      } else if (commit.type === 'perf') {
        commit.type = 'Performance Improvements';
      } else if (commit.type === 'revert') {
        commit.type = 'Reverts';
      } else if (discard) {
        return;
      } else if (commit.type === 'docs') {
        commit.type = 'Documentation';
      } else if (commit.type === 'style') {
        commit.type = 'Styles';
      } else if (commit.type === 'refactor') {
        commit.type = 'Code Refactoring';
      } else if (commit.type === 'test') {
        commit.type = 'Tests';
      } else if (commit.type === 'build') {
        commit.type = 'Build System';
      } else if (commit.type === 'ci') {
        commit.type = 'Continuous Integration';
      }

      if (commit.scope === '*') {
        commit.scope = '';
      }

      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7);
      }
      if (typeof commit.issue === 'string') {
        const issue = commit.issue;
        const url = '***REMOVED***/';
        commit.issue = `[${issue}](${url}${issue})`;
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter((reference) => {
        if (issues.indexOf(reference.issue) === -1) {
          return true;
        }

        return false;
      });

      return commit;
    },
    groupBy: `type`,
    commitGroupsSort: `title`,
    commitsSort: [`scope`, `subject`],
    noteGroupsSort: `title`,
    notesSort: compareFunc,
  };
}
