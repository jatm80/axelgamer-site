const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const chart = JSON.parse(read('src/data/potion_chart.json'));
const recipes = new Map(chart.recipes.map(recipe => [recipe.id, recipe]));
const asset = 'src/static/assets/minecraft/potion-brewing-chart/minecraft-potion-brewing-chart';
const url = '/minecraft/potion-brewing-chart/';

describe('Printable Minecraft potion brewing chart', () => {
  it('covers every brewable Survival effect, including conversion and Weakness paths', () => {
    const expected = ['night-vision', 'water-breathing', 'fire-resistance', 'strength', 'swiftness',
      'leaping', 'healing', 'regeneration', 'poison', 'slow-falling', 'turtle-master',
      'wind-charging', 'weaving', 'oozing', 'infestation', 'invisibility', 'slowness', 'harming', 'weakness'];
    assert.deepStrictEqual([...recipes.keys()].sort(), expected.sort());
    assert.strictEqual(chart.recipes.length, recipes.size, 'recipe IDs must be unique');
    assert.strictEqual(recipes.get('weakness').base, 'Water bottle');
    assert.strictEqual(recipes.get('invisibility').base, 'Night Vision');
    assert.strictEqual(recipes.get('slowness').base, 'Swiftness or Leaping');
    assert.strictEqual(recipes.get('harming').base, 'Healing or Poison');
    for (const id of ['weakness', 'invisibility', 'slowness', 'harming']) {
      assert.strictEqual(recipes.get(id).ingredient, 'Fermented spider eye');
    }
    assert.strictEqual(chart.recipes.filter(recipe => recipe.base === 'Awkward').length, 15);
  });

  it('preserves edition differences and unsupported modifier limits', () => {
    assert.strictEqual(recipes.get('regeneration').extended, 'J 1:30 / B 2:00');
    assert.strictEqual(recipes.get('poison').extended, 'J 1:30 / B 2:00');
    assert.strictEqual(recipes.get('poison').enhanced, 'II · J 0:21 / B 0:22');
    assert.strictEqual(recipes.get('slowness').enhanced, 'IV · 0:20');
    for (const id of ['wind-charging', 'weaving', 'oozing', 'infestation']) {
      assert.strictEqual(recipes.get(id).normal, '3:00');
      assert.strictEqual(recipes.get(id).extended, '—');
      assert.strictEqual(recipes.get(id).enhanced, '—');
    }
    for (const id of ['night-vision', 'water-breathing', 'fire-resistance', 'invisibility', 'slow-falling', 'weakness']) {
      assert.strictEqual(recipes.get(id).enhanced, '—');
    }
    for (const id of ['healing', 'harming']) {
      assert.strictEqual(recipes.get(id).normal, 'Instant');
      assert.strictEqual(recipes.get(id).extended, '—');
    }
  });

  it('ships a high-resolution PNG, complete vector poster, and one downloadable PDF', () => {
    const png = fs.readFileSync(path.join(root, `${asset}.png`));
    assert.strictEqual(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.strictEqual(png.readUInt32BE(16), 3508);
    assert.strictEqual(png.readUInt32BE(20), 4961);
    const svg = read(`${asset}.svg`);
    assert.match(svg, /width="297mm" height="420mm"/);
    assert.match(svg, /viewBox="0 0 1400 1980"/);
    for (const recipe of chart.recipes) {
      assert(svg.includes(`>${recipe.name}</text>`), `${recipe.name} missing from poster`);
      assert(svg.includes(recipe.ingredient), `${recipe.ingredient} missing from poster`);
    }
    assert.match(svg, /gunpowder/);
    assert.match(svg, /dragon’s breath/);
    assert.match(svg, /Water bottle \+ fermented spider eye/);
    assert.strictEqual(fs.readFileSync(path.join(root, `${asset}.pdf`)).subarray(0, 5).toString(), '%PDF-');
  });

  it('connects the resource from Minecraft, the potion hub and every individual guide', () => {
    const files = ['src/content/minecraft.md', 'src/content/minecraft/potions/_index.md',
      'src/content/sections/posts/minecraft-night-vision-potion-beginner-guide.md',
      ...['water-breathing', 'fire-resistance', 'invisibility', 'strength'].map(id => `src/content/minecraft/potions/${id}.md`)];
    for (const file of files) assert(read(file).includes(`](${url})`), `${file} must link to chart`);
    const page = read('src/content/minecraft/potion-brewing-chart.md');
    assert(page.includes(`url = "${url}"`));
    assert.match(page, /type = "posts"/);
    assert.match(page, /layout = "potion-chart"/);
    assert.match(page, /topics = .*"minecraft".*"potions"/);
  });
});
