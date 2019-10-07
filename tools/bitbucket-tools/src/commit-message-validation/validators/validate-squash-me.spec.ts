import { PrError } from '../validate-commits-in-pull-request';
import { validateSquashMe } from './validate-squash-me';

describe('squash me', () => {
  test('"squash me" should result into an error', () => {
    expect(validateSquashMe('squash me')).toBeInstanceOf(PrError);
  });

  test('"squash" should result into an error', () => {
    expect(validateSquashMe('squash')).toBeInstanceOf(PrError);
  });

  test('"squash-me" should result into an error', () => {
    expect(validateSquashMe('squash-me')).toBeInstanceOf(PrError);
  });

  test('"this needs rebase" should result into an error', () => {
    expect(validateSquashMe('this needs rebase')).toBeInstanceOf(PrError);
  });

  test('"asdf" should result into an error', () => {
    expect(validateSquashMe('asdf')).toBeInstanceOf(PrError);
  });
});
