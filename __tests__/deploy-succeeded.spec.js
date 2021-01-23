const {server} = require('./deploy-succeeded.mock');
const {advanceTo, clear} = require('jest-date-mock');
const rewire = require('rewire');

const deploySucceeded = rewire('../functions/deploy-succeeded');
const handleError = deploySucceeded.__get__('handleError');
const fetchFeed = deploySucceeded.__get__('fetchFeed');
const differenceInDays = deploySucceeded.__get__('differenceInDays');
const gateway = deploySucceeded.__get__('gateway');
const prepareStatusText = deploySucceeded.__get__('prepareStatusText');
const publishPost = deploySucceeded.__get__('publishPost');

beforeAll(() => server.listen());

afterAll(() => {
  server.close();
});

test('The most recent post is LESS than 7 days old', () => {
  // Arrange
  advanceTo(new Date(2021, 0, 1, 0, 0, 0));
  const now = new Date();
  const lessThan7days = '2021-01-06T12:15:31.627Z';

  // Act
  const actual = differenceInDays(now, lessThan7days);

  // Assert
  expect(actual).toBeLessThanOrEqual(7);

  clear();
});

describe('Prepare a status text for a tweet', () => {
  test('Status should NOT be truncated', () => {
    // Arrange
    const ingredient = {
      status: 'This is a test tweet with in 240 characters limit',
      // eslint-disable-next-line sonarjs/no-duplicate-string
      url: 'https://sixtysix.frontendweekly.tokyo/test-',
      siteName: 'Sixtysix',
    };
    // Act
    const actual = prepareStatusText(ingredient);
    // Assert
    const expected =
      'This is a test tweet with in 240 characters limit via Sixtysix: https://sixtysix.frontendweekly.tokyo/test-';
    expect(actual).toEqual(expected);
  });

  test(`Status should be truncated and won't exceed 280 characters limit`, () => {
    // Arrange
    const ingredient = {
      status:
        'This is a test tweet over 240 characters limit. This is a test tweet over 240 characters limit. This is a test tweet over 240 characters limit.',
      url: 'https://sixtysix.frontendweekly.tokyo/test-',
      siteName: 'Sixtysix',
    };
    // Act
    const actual = prepareStatusText(ingredient);
    // Assert
    const expected =
      'This is a test tweet over 240 characters limit. This is a test twee... via Sixtysix: https://sixtysix.frontendweekly.tokyo/test-';
    expect(actual).toEqual(expected);
    expect(String(actual).length).toBeLessThanOrEqual(280);
  });
});

test('publishPost works', async () => {
  const ingredient = {
    status:
      'This is a test tweet over 240 characters limit. This is a test tweet over 240 characters limit. This is a test tweet over 240 characters limit.',
    url: 'https://sixtysix.frontendweekly.tokyo/test-',
    siteName: 'Sixtysix',
  };
  const actual = await publishPost(ingredient);
  expect(actual).toMatchInlineSnapshot(`
    Object {
      "body": "Post \\"This is a test tweet over 240 characters limit. This is a test twee... via Sixtysix: https://sixtysix.frontendweekly.tokyo/test-\\" successfully posted to Twitter.",
      "statusCode": 200,
    }
  `);
});

test('integration test', async () => {
  advanceTo(new Date(2021, 0, 19, 0, 0, 0));
  const actual = await fetchFeed().then(gateway).catch(handleError);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "body": "Latest post is more than 7 days old, assuming already syndicated. No action taken.",
      "statusCode": 400,
    }
  `);

  clear();
});
