const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');

function frontMatterFiles(dir) {
  return fs.readdirSync(path.join(root, dir))
    .filter((name) => name.endsWith('.md') && name !== '_index.md')
    .map((name) => read(dir, name));
}

describe('AxelGamer SEO architecture', () => {
  it('uses page-specific metadata and does not emit meta keywords', () => {
    const head = read('src/layouts/partials/head.html');
    assert.doesNotMatch(head, /name="keywords"/i);
    assert.match(head, /\.Params\.seo_title/);
    assert.match(head, /\.Params\.description[\s\S]*\.Params\.summary/);
    assert.match(head, /video\.other/);
    assert.match(head, /site\.Params\.ogImage/);
  });

  it('emits VideoObject fields without fabricating optional values', () => {
    const head = read('src/layouts/partials/head.html');
    assert.match(head, /"VideoObject"/);
    assert.match(head, /\.Params\.upload_date/);
    assert.match(head, /\.Params\.duration/);
    assert.doesNotMatch(head, /uploadDate"\s+"[0-9]/);
    assert.doesNotMatch(head, /duration"\s+"PT/);
  });

  it('excludes homepage helper content from the sitemap', () => {
    for (const helper of ['hero', 'about', 'articles', 'resources']) {
      assert.match(read('src/content/sections/homepage', `${helper}.md`), /\[sitemap\][\s\S]*disable = true/);
    }
    const sitemap = read('src/layouts/sitemap.xml');
    assert.match(sitemap, /not \(hasPrefix \.RelPermalink "\/sections\/"\)/);
  });
});
