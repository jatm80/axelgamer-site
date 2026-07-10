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

  it('supports mobile touch controls for Snake', () => {
    const snake = read('src/static/games/snake/index.html');

    assert.match(snake, /class="touch-controls"/, 'Snake should render on-screen mobile controls');
    assert.match(snake, /data-direction="up"/, 'Snake should include an up touch button');
    assert.match(snake, /data-direction="down"/, 'Snake should include a down touch button');
    assert.match(snake, /data-direction="left"/, 'Snake should include a left touch button');
    assert.match(snake, /data-direction="right"/, 'Snake should include a right touch button');
    assert.match(snake, /addEventListener\('touchstart'/, 'Snake should handle touchstart to avoid mobile scrolling lag');
    assert.match(snake, /function setDirection\(direction\)/, 'Keyboard and touch controls should share direction logic');
  });

  it('publishes Banana Battle at /games/banana-battle/ with mobile controls', () => {
    const homeGames = read('src/layouts/partials/homepage/games.html');
    const banana = read('src/static/games/banana-battle/index.html');

    assert.match(homeGames, /\/games\/banana-battle\//, 'homepage games grid should link to Banana Battle');
    assert.match(homeGames, /Banana Battle/, 'homepage games grid should name Banana Battle');
    assert.match(banana, /<title>Banana Battle Demo/, 'Banana Battle page should keep the demo title');
    assert.match(banana, /class="mobile-controls"/, 'Banana Battle should render mobile controls');
    assert.match(banana, /data-action="angle-down"/, 'Banana Battle should include touch angle-down control');
    assert.match(banana, /data-action="angle-up"/, 'Banana Battle should include touch angle-up control');
    assert.match(banana, /data-action="power-down"/, 'Banana Battle should include touch power-down control');
    assert.match(banana, /data-action="power-up"/, 'Banana Battle should include touch power-up control');
    assert.match(banana, /data-action="throw"/, 'Banana Battle should include touch throw control');
    assert.match(banana, /touch-action:\s*none/, 'Canvas should suppress browser gestures while playing on mobile');
    assert.match(banana, /addEventListener\('touchstart'/, 'Mobile controls should use touchstart to avoid tap delay');
    assert.match(banana, /function handleControlAction\(action\)/, 'Keyboard and touch controls should share control logic');
  });
});
