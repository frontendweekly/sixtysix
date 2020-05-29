const truncate = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

module.exports = class {
  async data() {
    return {
      permalink: `/feed.json`,
      eleventyExcludeFromCollections: true,
    };
  }

  async render(data) {
    const feed = {};

    feed.version = 'https://jsonfeed.org/version/1';
    feed.user_comment = `This is a blog feed. You can add this to your feed reader using the following URL: ${data.site.url}/feed.json`;
    feed.title = `${data.site.name}`;
    feed.home_page_url = `${data.site.url}`;
    feed.feed_url = `${data.site.url}/feed.json`;
    feed.description = `${data.site.description}`;
    feed.favicon = `${data.site.url}/favicon.ico`;
    feed.author = {
      name: `${data.site.author.name}`,
      url: `${data.site.url}`,
    };

    feed.items = [];

    for (const post of data.collections.posts) {
      const absolutePostUrl = `${data.site.url}${post.filePathStem}`;

      const item = {
        id: absolutePostUrl,
        url: absolutePostUrl,
      };

      item.title = truncate(post.data.quote, 60);
      item.summary = truncate(post.data.quote, 120);
      item.content_html = post.templateContent;
      item.date_published = post.data.date;

      feed.items.push(item);
    }

    return JSON.stringify(feed, null, 2);
  }
};
