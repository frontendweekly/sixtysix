const path = require('path');
const fs = require('fs');

const matter = require('gray-matter');
const arg = require('arg');

/// Helper Function to return unknown errors
const handleError = err => {
  console.error(err);
  process.exit(1);
};

// Posts location
const POSTS_DIR = path.resolve(process.env.PWD, 'src/posts');

// Command line Arguments
const args = arg({
  // Types
  '--date': String,
  '--quoteBy': String,
  '--cite': String,
  '--link': String,
  '--when': String,
  '--author': String,

  // Aliases
  '-d': '--date',
  '-q': '--quoteBy',
  '-c': '--cite',
  '-l': '--link',
  '-w': '--when',
  '-a': '--author'
});

const options = {
  date: args['--date'] || '',
  quoteBy: args['--quoteBy'] || 'WHOSE QUOTE IS IT',
  cite: args['--cite'] || '',
  when: args['--when'] || '2005, June 12',
  link: args['--link'] || '',
  author: args['--author'] || ''
};

const frontMatter = () => {
  const today = new Date().toISOString();
  const file = `
> {{ quote | safe }}
> — {{ quoteBy | quoteByJoin }}, [{{ cite }}]({{ link }}). ({{ when }})
`;

  return matter.stringify(file, {
    date: options.date || today,
    quote: '|-',
    quoteBy: options.quoteBy,
    cite: options.cite,
    link: options.link,
    when: options.when,
    author: options.author
  });
};

// Save md
const savePost = () => {
  const filePath = `${POSTS_DIR}/${(+new Date()).toString(36)}.md`;
  try {
    console.log(`Creating new post: ${filePath}`);
    fs.writeFileSync(filePath, frontMatter(), 'utf-8');
  } catch (err) {
    handleError(err);
  }
};

savePost();

module.exports = {frontMatter, savePost};
