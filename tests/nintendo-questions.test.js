const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const directory = path.join(root, 'src/content/nintendo');
const read = (file) => fs.readFileSync(file, 'utf8');
const expected = [
  'is-captain-toad-treasure-tracker-two-player',
  'is-kirby-and-the-forgotten-land-two-player',
  'does-luigis-mansion-3-support-local-co-op',
  'is-nintendo-switch-sports-two-player',
  'is-yoshis-crafted-world-hard-for-beginners',
];
const articles = expected.map((slug) => {
  const source = read(path.join(directory, `${slug}.md`));
  const [, frontMatter, body] = source.split('+++');
  const field = (name) => JSON.parse(frontMatter.match(new RegExp(`^${name} = (".*")$`, 'm'))[1]);
  return { slug, source, frontMatter, body, field };
});

describe('Nintendo family question articles', () => {
  it('publishes one distinct question for each of the five initial games', () => {
    assert.strictEqual(articles.length, 5);
    for (const article of articles) {
      assert.match(article.field('title'), /\?$/);
      assert.strictEqual(article.field('url'), `/nintendo/${article.slug}/`);
      assert.match(article.frontMatter, /^type = "posts"$/m);
      assert.match(article.frontMatter, /^draft = false$/m);
      assert.match(article.frontMatter, /^topics = \["nintendo", "family-gaming"\]$/m);
      assert.match(article.body.trim(), /^\*\*[^\n]+\*\*/, 'the first paragraph must include a direct answer');
    }
    for (const field of ['title', 'seo_title', 'description', 'url']) {
      assert.strictEqual(new Set(articles.map((article) => article.field(field))).size, 5, `${field} must be unique`);
    }
  });

  it('connects every article to the hub, existing editorial content, and a sibling question', () => {
    const hub = read(path.join(root, 'src/content/nintendo-switch.md'));
    for (const article of articles) {
      const links = [...article.body.matchAll(/\]\((\/[^)]+)\)/g)].map((match) => match[1]);
      assert(links.includes('/nintendo-switch/'));
      assert(links.some((link) => link.startsWith('/posts/')));
      assert(links.some((link) => articles.some((sibling) => sibling.slug !== article.slug && sibling.field('url') === link)));
      assert(hub.includes(`](${article.field('url')})`), 'hub must link directly to each question');
    }
  });

  it('provides official Nintendo factual sources', () => {
    for (const article of articles) {
      const sources = [...article.body.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((match) => new URL(match[1]));
      assert(sources.length >= 1);
      assert(sources.every((url) => url.hostname === 'nintendo.com' || url.hostname.endsWith('.nintendo.com')));
    }
  });
});
