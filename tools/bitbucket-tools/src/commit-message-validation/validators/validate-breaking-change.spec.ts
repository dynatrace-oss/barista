import { PrError } from '../validate-commits-in-pull-request';
import { validateBreakingChange } from './validate-breaking-change';

describe('breaking change', () => {
  test('"set linebreaks to LF ALWAYS" should not result in an error', () => {
    expect(
      validateBreakingChange('set linebreaks to LF ALWAYS'),
    ).toBeUndefined();
  });

  test('"this breaks things" should result in an error', () => {
    expect(validateBreakingChange('this breaks things')).toBeInstanceOf(
      PrError,
    );
  });

  test('"this did something breaking change" should result in an error', () => {
    expect(
      validateBreakingChange('this did something breaking change'),
    ).toBeInstanceOf(PrError);
  });

  test('"this breaks things BREAKING CHANGE" should not result in an error', () => {
    expect(
      validateBreakingChange('this breaks things BREAKING CHANGE'),
    ).toBeUndefined();
  });
});
