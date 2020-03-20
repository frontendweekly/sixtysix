const {advanceBy, advanceTo, clear} = require('jest-date-mock');
const {frontMatter, savePost} = require('../_task/build-post');
const fs = require('fs');

jest.mock('fs');

describe('Front matter for new content', () => {
  beforeEach(() => {
    advanceTo(new Date(2020, 2, 15, 0, 0, 0));
  });

  afterEach(() => {
    clear();
  });

  test.skip('default', () => {
    // Arrange

    // Act
    const actual = frontMatter();

    // Assert
    const expected = `
---
date: '${new Date().toISOString()}'
quote: '|-'
tags: WHOSE QUOTE IS IT
cite: ''
link: ''
when: '2005, June 12'
author: ''
---
> {{ quote | safe }}
> — {{ quoteBy | quoteByJoin }}, [{{ cite }}]({{ link }}). ({{ when }})
`;

    expect(actual).toMatch(expected);
  });

  test('generate md file', () => {
    // Act
    savePost();

    // Assert
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});
