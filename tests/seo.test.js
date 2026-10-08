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

  it('stores only the verified YouTube date and duration for confirmed public videos', () => {
    const confirmed = {
      'melbourne-motorshow-2026.md': ['85KKWAbUlT4', '2026-04-11', 'PT7M42S'],
      'camping-day-upper-yarra.md': ['5ukjMUGGssA', '2026-03-26', 'PT13M25S'],
      'cooking-tuna-casserole-with-my-dad.md': ['vAImg84kS_w', '2026-06-20', 'PT22M5S'],
      'axel-gamer-on-a-roll-3d.md': ['f4GemvGLqGw', '2024-06-02', 'PT15M29S'],
    };
    const videoDir = path.join(root, 'src/content/videos');
    for (const filename of fs.readdirSync(videoDir).filter((name) => name.endsWith('.md') && name !== '_index.md')) {
      const video = read('src/content/videos', filename);
      if (confirmed[filename]) {
        const [videoId, uploadDate, duration] = confirmed[filename];
        assert.match(video, new RegExp(`video_id = "${videoId}"`));
        assert.match(video, new RegExp(`upload_date = "${uploadDate}"`));
        assert.match(video, new RegExp(`duration = "${duration}"`));
      } else {
        assert.doesNotMatch(video, /^upload_date\s*=/m, `${filename} has an unverified upload date`);
        assert.doesNotMatch(video, /^duration\s*=/m, `${filename} has an unverified duration`);
      }
    }
  });

  it('publishes crawlable video pages and links to them from the homepage', () => {
    const homeVideos = read('src/layouts/partials/homepage/videos.html');
    const videoFiles = frontMatterFiles('src/content/videos');
    assert.ok(videoFiles.length > 0, 'dedicated video content should exist');
    assert.match(homeVideos, /site\.GetPage "\/videos"/);
    assert.match(homeVideos, /<a[^>]+href="{{ \.RelPermalink }}"/);
    for (const video of videoFiles) {
      assert.match(video, /type = "video"/);
      assert.match(video, /summary = ".+"/);
      assert.match(video, /video_id = ".+"/);
    }
  });

  it('keeps public game landing pages separate from noindex game embeds', () => {
    for (const slug of ['snake', 'banana-battle', 'perfect-landing']) {
      const landing = read('src/content/games', `${slug}.md`);
      const embed = read('src/static/game-embeds', slug, 'index.html');
      assert.match(landing, new RegExp(`slug = "${slug}"`));
      assert.match(landing, new RegExp(`embed = "/game-embeds/${slug}/"`));
      assert.match(embed, /<meta name="robots" content="noindex,nofollow">/);
    }
  });

  it('defines curated topic hubs and shared-topic related content', () => {
    for (const hub of ['minecraft', 'nintendo-switch', 'roblox']) {
      assert.match(read('src/content', `${hub}.md`), /layout = "topic"/);
    }
    const related = read('src/layouts/partials/related-content.html');
    assert.match(related, /\.Params\.topics/);
    assert.match(related, /first 4/);
    assert.match(related, /ne \.RelPermalink \$page\.RelPermalink/);
  });

  it('excludes homepage helper content from the sitemap', () => {
    for (const helper of ['hero', 'about', 'articles', 'resources']) {
      assert.match(read('src/content/sections/homepage', `${helper}.md`), /\[sitemap\][\s\S]*disable = true/);
    }
    const sitemap = read('src/layouts/sitemap.xml');
    assert.match(sitemap, /not \(hasPrefix \.RelPermalink "\/sections\/"\)/);
  });
});
