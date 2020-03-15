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

  test('default', () => {
    // Arrange

    // Act
    const actual = frontMatter();

    // Assert
    const expected = `---
title: THIS IS YOUR TITLE OF POST
date: '${new Date().toISOString()}'
quoteBy: WHOSE QUOTE IS IT
author: WHO POST THIS QUOTE
---
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
