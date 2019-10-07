import { splitTitleIntoComponents } from './add-tags-to-pull-request';

describe('split title into title components', () => {
  it('should split a simple title without tags', () => {
    const title = 'This is my simple pr title';
    expect(splitTitleIntoComponents(title)).toMatchObject({
      title,
      tags: [],
    });
  });

  it('should detect a single tag and strip it from the title', () => {
    const title = '[wip] This is my simple pr title';
    expect(splitTitleIntoComponents(title)).toMatchObject({
      title: 'This is my simple pr title',
      tags: ['wip'],
    });
  });

  it('should detect a multiple tags and strip it from the title', () => {
    const title = '[wip] [major] This is my simple pr title';
    expect(splitTitleIntoComponents(title)).toMatchObject({
      title: 'This is my simple pr title',
      tags: ['wip', 'major'],
    });
  });

  it('should detect a multiple tags anywhere strip it from the title', () => {
    const title = '[wip] This is my simple pr [major] title';
    expect(splitTitleIntoComponents(title)).toMatchObject({
      title: 'This is my simple pr title',
      tags: ['wip', 'major'],
    });
  });

  it('should detect a multiple tags anywhere strip it from the title', () => {
    const title =
      "[wip] [major] [don't merge] [needs halp] This is my simple pr title";
    expect(splitTitleIntoComponents(title)).toMatchObject({
      title: 'This is my simple pr title',
      tags: ['wip', 'major', "don't merge", 'needs halp'],
    });
  });

  it('should remove duplicates from tags', () => {
    const title = '[wip] [wip] [wip] [needs halp] This is my simple pr title';
    expect(splitTitleIntoComponents(title)).toMatchObject({
      title: 'This is my simple pr title',
      tags: ['wip', 'needs halp'],
    });
  });

  it('should ignore empty tags', () => {
    const title = '[ ] This is my simple pr title';
    expect(splitTitleIntoComponents(title)).toMatchObject({
      title: 'This is my simple pr title',
      tags: [],
    });
  });

  it('should detect uppercase tags as and match them as well', () => {
    const title = '[WIP] This is my simple pr title';
    expect(splitTitleIntoComponents(title)).toMatchObject({
      title: 'This is my simple pr title',
      tags: ['wip'],
    });
  });

  it('should detect mixed case tags as and match them as well', () => {
    const title = '[WIP] [nEeDs-woRK] This is my simple pr title';
    expect(splitTitleIntoComponents(title)).toMatchObject({
      title: 'This is my simple pr title',
      tags: ['wip', 'needs-work'],
    });
  });
});
