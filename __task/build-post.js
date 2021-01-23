const path = require('path');
const fs = require('fs');

const qoa = require('qoa');
const signale = require('signale');
const matter = require('gray-matter');

// `/posts` location
const POSTS_DIR = path.resolve(process.env.PWD, 'src/posts');

/// Helper Function to return unknown errors
const handleError = (err) => {
  signale.fatal(err);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
};

const ps = [
  {
    type: 'input',
    query: `The quote itself:`,
    handle: 'quote',
  },
  {
    type: 'input',
    query: `Who's quote it it?:`,
    handle: 'quoteBy',
  },
  {
    type: 'input',
    query: `Where quote is cited from? Most likely title of the article:`,
    handle: 'cite',
  },
  {
    type: 'input',
    query: `URL of the quote:`,
    handle: 'link',
  },
  {
    type: 'input',
    query: `When the work published? (e.g. 2020, Apr 3):`,
    handle: 'when',
  },
];

const frontMatter = async () => {
  const options = await qoa.prompt(ps);

  const file = `
> {{ quote | safe }}
> — {{ tags | tagsToSentence | safe }}, [{{ cite }}]({{ link }}). ({{ when }})
`;

  return matter.stringify(file, {
    date: new Date(),
    tags: options.quoteBy.split(','),
    cite: options.cite,
    link: options.link,
    when: options.when,
    quote: options.quote,
  });
};

frontMatter().then((result) => {
  // Save md
  const filePath = `${POSTS_DIR}/${(+new Date()).toString(36)}.md`;
  try {
    signale.success(`Creating new post: ${filePath}`);
    fs.writeFileSync(filePath, result, 'utf-8');
  } catch (err) {
    handleError(err);
  }
});
