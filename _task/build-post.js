const path = require('path');
const fs = require('fs');

const matter = require('gray-matter');
const arg = require('arg');

// Import data files
const {author} = require('../src/_data/site.json');

// `/posts` location
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
  '-a': '--author',
});

const options = {
  date: args['--date'] || new Date().toISOString(),
  quoteBy: args['--quoteBy'] || 'WHOSE QUOTE IS IT',
  cite: args['--cite'] || '',
  when: args['--when'] || '',
  link: args['--link'] || '',
  author: args['--author'] || author.name,
};

/// Helper Function to return unknown errors
const handleError = (err) => {
  console.error(err);
  process.exit(1);
};

const frontMatter = () => {
  const file = `
> {{ quote | safe }}
> — {{ tags | quoteByJoin }}, [{{ cite }}]({{ link }}). ({{ when }})
`;

  return matter.stringify(file, {
    date: options.date,
    quote: `|-`,
    tags: options.quoteBy,
    cite: options.cite,
    link: options.link,
    when: options.when,
    author: options.author,
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
