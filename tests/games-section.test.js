const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');

describe('AxelGamer games section', () => {
  it('adds Games to the main navigation and homepage', () => {
    const header = read('src/layouts/partials/header.html');
    const home = read('src/layouts/index.html');

    assert.match(header, /#games|\/games\//, 'header should link to the Games section or page');
    assert.match(home, /homepage\/games\.html/, 'homepage should render the Games partial');
  });

  it('publishes Snake at /games/snake/ with no wall wrapping', () => {
    const snake = read('src/static/games/snake/index.html');

    assert.match(snake, /<title>Snake/, 'Snake page should have a clear title');
    assert.match(snake, /GAME OVER/, 'Snake should show game-over text');
    assert.doesNotMatch(snake, /wall wrap/i, 'Snake must not keep wall-wrap behaviour');
    assert.doesNotMatch(snake, /head\.x\s*=\s*GRID\s*-\s*1|head\.x\s*=\s*0|head\.y\s*=\s*GRID\s*-\s*1|head\.y\s*=\s*0/, 'Snake should not teleport across edges');
    assert.match(snake, /head\.x\s*<\s*0[\s\S]*head\.x\s*>=\s*GRID[\s\S]*head\.y\s*<\s*0[\s\S]*head\.y\s*>=\s*GRID/, 'Snake should detect edge collisions');
  });
});
