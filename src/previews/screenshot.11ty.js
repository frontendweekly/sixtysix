const fs = require('fs');
const path = require('path');
const {html, css, raw} = require('ucontent');
const puppeteer = require('puppeteer');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const tagToSentence = require('@frontendweekly/filter-tags-to-sentence');

const getCacheList = () => {
  const filePath = path.resolve(__dirname, '../../.cache/cache-preview.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath));
  }
  return [];
};

const markup = (data) => {
  const logo = raw(data.site.logo);
  const style = css(
    `${fs.readFileSync(path.join(__dirname, '../_includes/assets/styles/main.css'))}`
  );
  const langSwitch = (lang) => (lang === 'ja' ? `lang=${lang}` : '');
  const tags = (tags) => raw(tagToSentence(tags));

  return html`
    <!DOCTYPE html>
    <html lang="${data.site.lang}">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>${data.site.name}</title>
        <style>
          ${style}
        </style>
      </head>
      <body>
        <article class="c-preview h-entry" ${langSwitch(data.lang)}>
          <span class="c-preview__logo">${logo}</span>
          <div class="c-preview__inner-wrapper">
            <figure class="c-blockquote">
              <blockquote>
                <p>${data.quote}</p>
              </blockquote>
              <figcaption class="c-blockquote__attribution">
                — ${tags(data.tags)}, ${data.cite} (${data.when})
              </figcaption>
            </figure>
          </div>
        </article>
      </body>
    </html>
  `.min();
};

module.exports = class {
  async data() {
    return {
      pagination: {
        data: 'collections.posts',
        size: 1,
        alias: 'screenshot',
      },
      permalink: (data) => {
        return `/previews/${data.screenshot.fileSlug}/preview.png`;
      },
      eleventyExcludeFromCollections: true,
    };
  }

  async optimize(png) {
    return await imagemin.buffer(png, {
      plugins: [imageminPngquant()],
    });
  }

  async getscreenshot(dom) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(dom, {
      waitUntil: ['networkidle0'],
    });

    await page.setViewport({
      width: 1200,
      height: 628,
      deviceScaleFactor: 2,
    });

    const screenshot = await page.screenshot({
      clip: {x: 0, y: 0, width: 1200, height: 628},
    });

    browser.close();

    return await this.optimize(screenshot);
  }

  async render(data) {
    const fileSlug = data.screenshot.data.page.fileSlug;
    const cacheList = getCacheList();
    const hasCache = () => cacheList.filter((item) => item.includes(fileSlug))[0];
    const isProd = process.env.ELEVENTY_ENV === 'production';

    if (isProd && !hasCache()) {
      console.log(`Create a new screenshot`);
      const dom = markup(data.screenshot.data);
      return this.getscreenshot(dom.toString());
    }
  }
};
