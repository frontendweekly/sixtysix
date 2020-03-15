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
  '--title': String,
  '--date': String,
  '--quoteBy': String,
  '--author': String,

  // Aliases
  '-t': '--title',
  '-d': '--date',
  '-q': '--quoteBy',
  '-a': '--author'
});

const options = {
  title: args['--title'] || 'THIS IS YOUR TITLE OF POST',
  date: args['--date'] || '',
  quoteBy: args['--quoteBy'] || 'WHOSE QUOTE IS IT',
  author: args['--author'] || 'WHO POST THIS QUOTE'
};

const frontMatter = () => {
  const today = new Date().toISOString();
  return matter.stringify('', {
    title: options.title,
    date: options.date || today,
    quoteBy: options.quoteBy,
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
