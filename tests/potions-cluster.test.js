const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const hubUrl = '/minecraft/potions/';
const guides = [
  ['src/content/sections/posts/minecraft-night-vision-potion-beginner-guide.md', '/posts/minecraft-night-vision-potion-beginner-guide/'],
  ...['water-breathing', 'fire-resistance', 'invisibility', 'strength'].map(slug => [
    `src/content/minecraft/potions/${slug}.md`, `${hubUrl}${slug}/`,
  ]),
];
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const links = text => [...text.matchAll(/\]\((\/[^)]+)\)/g)].map(match => match[1]);

describe('Minecraft potion content cluster', () => {
  it('connects the brewing hub, five distinct guides, and Minecraft discovery page', () => {
    const hub = read('src/content/minecraft/potions/_index.md');
    const hubLinks = links(hub);
    assert.ok(links(read('src/content/minecraft.md')).includes(hubUrl));
    const urls = new Set(guides.map(([, url]) => url));
    assert.strictEqual(urls.size, 5, 'each guide must have its own public URL');
    for (const [file, url] of guides) {
      assert.ok(hubLinks.includes(url), `brewing hub must link to ${url}`);
      const guideLinks = links(read(file));
      assert.ok(guideLinks.includes(hubUrl), `${file} must link back to brewing hub`);
      assert.ok(guideLinks.includes('/minecraft/'), `${file} must link to Minecraft`);
      assert.ok(guideLinks.filter(link => urls.has(link) && link !== url).length >= 2,
        `${file} needs relevant sibling routes`);
    }
  });

  it('publishes distinct search metadata, brewing answers, edition guidance and limitations', () => {
    const titles = new Set();
    const descriptions = new Set();
    for (const file of ['src/content/minecraft/potions/_index.md', ...guides.map(([file]) => file)]) {
      const text = read(file);
      const [frontMatter, body] = text.split('+++').slice(1);
      const title = frontMatter.match(/^title = "(.+)"/m)?.[1];
      const description = frontMatter.match(/^description = "(.+)"/m)?.[1];
      assert.ok(title && description, `${file} needs search metadata`);
      assert.ok(!titles.has(title) && !descriptions.has(description), `${file} has duplicate metadata`);
      titles.add(title);
      descriptions.add(description);
      assert.match(frontMatter, /topics = .*potions/);
      assert.match(body.trimStart(), /^\*\*.+\*\*/, `${file} should answer directly at the top`);
      for (const section of ['Ingredients', 'Step-by-step', 'Java and Bedrock', 'Common mistakes']) {
        assert.ok(body.includes(section), `${file} is missing ${section}`);
      }
      assert.match(body, /[Dd]uration/);
      assert.match(body, /redstone/i);
      assert.match(body, /glowstone/i);
      assert.match(body, /https:\/\/(www\.minecraft\.net|learn\.microsoft\.com)\//,
        `${file} should include a primary source for readers`);
    }
  });

  it('retains the established Night Vision URL without introducing a competing recipe page', () => {
    const nightVision = read(guides[0][0]);
    assert.match(nightVision, /url = "\/posts\/minecraft-night-vision-potion-beginner-guide\/"/);
    const potionFiles = fs.readdirSync(path.join(root, 'src/content/minecraft/potions'));
    assert.ok(!potionFiles.some(file => /night[-_]vision/i.test(file)));
  });
});
