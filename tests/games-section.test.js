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
    assert.match(banana, /<title>Banana Battle — Pixel Gorillas<\/title>/, 'Banana Battle page should use a finished-game title');
    assert.doesNotMatch(banana, /\bdemo\b/i, 'Banana Battle should not describe itself as a demo');
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

  it('maps Banana Battle plus/minus controls correctly and allows harder throws', () => {
    const banana = read('src/static/games/banana-battle/index.html');

    assert.match(banana, /const MIN_ANGLE = -90;/, 'Banana Battle should allow straight-down negative angles');
    assert.match(banana, /const MAX_ANGLE = 90;/, 'Banana Battle should allow straight-up angles');
    assert.match(banana, /const MAX_POWER = 1000000;/, 'Banana Battle should allow absurdly hard throws on request');
    assert.match(banana, /if \(action === 'angle-up'\) angle = clamp\(angle \+ 2, MIN_ANGLE, MAX_ANGLE\);/, 'Angle plus should increase angle');
    assert.match(banana, /if \(action === 'angle-down'\) angle = clamp\(angle - 2, MIN_ANGLE, MAX_ANGLE\);/, 'Angle minus should decrease angle');
    assert.match(banana, /if \(action === 'power-up'\) power = clamp\(power \+ 2, MIN_POWER, MAX_POWER\);/, 'Power plus should increase power');
    assert.match(banana, /if \(action === 'power-down'\) power = clamp\(power - 2, MIN_POWER, MAX_POWER\);/, 'Power minus should decrease power');
    assert.match(banana, /let ignoreNextSyntheticClick = false;/, 'Touch controls should suppress the follow-up synthetic click on mobile');
  });

  it('ends Banana Battle with a trophy winner when a monkey is hit', () => {
    const banana = read('src/static/games/banana-battle/index.html');

    assert.match(banana, /let gameOver = false;/, 'Banana Battle should track game-over state');
    assert.match(banana, /gameOver = true;/, 'A hit should end the game');
    assert.match(banana, /🏆/, 'Winner message should include a trophy');
    assert.match(banana, /Winner:/, 'Winner message should clearly name the winner');
    assert.match(banana, /function drawWinnerOverlay\(\)/, 'Winner should be drawn as a dedicated centered overlay');
    assert.match(banana, /if \(!gameOver\) return;/, 'Winner overlay should only render after game over');
    assert.match(banana, /ctx\.font = '32px Courier New, monospace';/, 'Winner overlay should be 2x the current 16px HUD message size');
    assert.match(banana, /ctx\.textAlign = 'center';[\s\S]*ctx\.fillText\(message, W \/ 2, H \/ 2\)/, 'Winner overlay should be centered on the canvas');
    assert.match(banana, /if \(banana \|\| gameOver\) return;/, 'No more bananas should be thrown after game over');
    assert.doesNotMatch(banana, /Press Space to throw again\./, 'A hit should not prompt another throw');
  });

  it('publishes Perfect Landing at /games/perfect-landing/ with homepage card and mobile controls', () => {
    const homeGames = read('src/layouts/partials/homepage/games.html');
    const styles = read('src/styles.css');
    const game = read('src/static/games/perfect-landing/index.html');

    assert.match(homeGames, /\/games\/perfect-landing\//, 'homepage games grid should link to Perfect Landing');
    assert.match(homeGames, /Perfect Landing/, 'homepage games grid should name Perfect Landing');
    assert.match(styles, /\.perfect-landing-thumb/, 'Perfect Landing should have a custom homepage thumbnail style');
    assert.match(game, /<title>Perfect Landing — Engine Out<\/title>/, 'Perfect Landing page should have a clear title');
    assert.match(game, /<canvas id="game"/, 'Perfect Landing should render a canvas game');
    assert.match(game, /data-action="pitch-up"/, 'Perfect Landing should include touch nose-up control');
    assert.match(game, /data-action="pitch-down"/, 'Perfect Landing should include touch nose-down control');
    assert.match(game, /touch-action:\s*none/, 'Perfect Landing should suppress browser gestures while playing on mobile');
    assert.match(game, /addEventListener\('touchstart'/, 'Mobile controls should use touchstart to avoid tap delay');
    assert.match(game, /let ignoreNextSyntheticClick = false;/, 'Touch controls should suppress the follow-up synthetic click on mobile');
  });

  it('keeps Perfect Landing engine-out rules, reset key, and lower airport approach buildings', () => {
    const game = read('src/static/games/perfect-landing/index.html');

    assert.match(game, /const ENGINE_OUT_MESSAGE = 'ENGINE OUT! GLIDE TO THE RUNWAY';/);
    assert.match(game, /const WIN_SCORE = 80;/);
    assert.match(game, /const GROUND_MISS_SCORE_CAP = 79;/);
    assert.match(game, /const DIVE_SPEED_GAIN = 0\.018;/);
    assert.match(game, /const RECOVERY_LIFT_FROM_SPEED = 0\.036;/);
    assert.match(game, /const AIRPORT_APPROACH_DISTANCE = 300;/);
    assert.match(game, /const AIRPORT_APPROACH_HEIGHT_CAP = 59;/, 'Airport approach buildings should be half the previous 118 cap');
    assert.match(game, /if \(event\.code === 'KeyR'\) handleControlAction\('reset'\);/, 'R should reset the game');
    assert.match(game, /const speedEnergy = clamp\(plane\.vx - 2\.25, 0, 1\.85\);/);
    assert.match(game, /const recoveryLift = noseUp > 0 \? speedEnergy \* RECOVERY_LIFT_FROM_SPEED : 0;/);
    assert.match(game, /nearRunway \? AIRPORT_APPROACH_HEIGHT_CAP : Math\.round\(rand\(125, 270\)\)/);
    assert.match(game, /Math\.min\(GROUND_MISS_SCORE_CAP/);
    assert.doesNotMatch(game, /\bdemo\b/i, 'Perfect Landing production page should not describe itself as a demo');
  });

  it('draws Perfect Landing with the actual user-provided airplane image', () => {
    const game = read('src/static/games/perfect-landing/index.html');
    const planeImage = fs.readFileSync(path.join(root, 'src/static/games/perfect-landing/plane.png'));

    assert.equal(planeImage.toString('ascii', 1, 4), 'PNG', 'actual uploaded airplane image should be converted to a transparent PNG asset');
    assert.match(game, /const PLANE_IMAGE_SRC = 'plane\.png';/, 'Plane image should load from the route-local transparent asset');
    assert.match(game, /const PLANE_DRAW_W = 96;/, 'Plane should be drawn at a game-appropriate width');
    assert.match(game, /const PLANE_DRAW_H = 52;/, 'Plane should preserve the new biplane source image aspect ratio');
    assert.match(game, /const PLANE_W = 70;/, 'Collision box should be smaller than the drawn airplane');
    assert.match(game, /const PLANE_H = 34;/, 'Collision box should fit the new biplane image height');
    assert.match(game, /const planeImage = new Image\(\);/);
    assert.match(game, /planeImage\.src = PLANE_IMAGE_SRC;/);
    assert.match(game, /function drawActualAirplaneImage\(\)/);
    assert.match(game, /ctx\.drawImage\(planeImage, -PLANE_DRAW_W \/ 2, -PLANE_DRAW_H \/ 2, PLANE_DRAW_W, PLANE_DRAW_H\);/);
    assert.match(game, /drawActualAirplaneImage\(\);/, 'drawPlane should render the actual image');

    const colorType = planeImage[25];
    assert.ok(colorType === 4 || colorType === 6, 'transparent airplane PNG should have an alpha channel');
  });
});
