import parserOpts from './parser-opts';

export default {
  parserOpts,

  whatBump: (commits) => {
    let level = 2;
    let breakings = 0;
    let features = 0;

    commits.forEach((commit) => {
      if (commit.subject && commit.subject.indexOf('BREAKING CHANGE') !== -1) {
        breakings += 1;
        level = 0;
      } else if (commit.type === `feat`) {
        features += 1;
        if (level === 2) {
          level = 1;
        }
      }
    });

    return {
      level,
      reason: breakings === 1
        ? `There is ${breakings} BREAKING CHANGE and ${features} features`
        : `There are ${breakings} BREAKING CHANGES and ${features} features`,
    };
  },
};
