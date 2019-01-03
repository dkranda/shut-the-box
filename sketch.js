var wt = 500;             // width of the canvas
var ht = 500;             // height of the canvas
var game;                 // game to track during play
var status = 0;           // status of the game:
                          // 0 - ready to roll
                          // 1 - ready to pick
                          // 2 - game end
var diceRoll = [];        // array of current dice roll
var dice = [];            // array of dice objects for current roll
var availablePlays = [];  // array of plays available based on the current roll
                          // and state of the game

// initial setup
function setup() {
  createCanvas(wt, ht);
  game = new Game(12, 2, 2)
}

// drawing calls - called in a loop
function draw() {
  clear();
  background(51);
  drawGame();
  drawScore();
  drawDiceButton();
  drawDice();
  checkGame();
}

// draw the tiles across the top third of the canvas
function drawGame() {
  for (var i = 0; i < game.tiles.length; i++) {
    this.drawTile(i, game.tiles[i]);
  }
}

// draw the score (bottom right of canvas)
function drawScore()
{
  textSize(20);
  fill(255,255,255);
  text("Score: " + game.getScore(),wt * 0.90, ht * 0.98);
}

// check whether the game is a win or a loss
function checkGame()
{
  if (game.isWin()) {
    status = 2;
    drawWin();
  } else if (status > 0 && game.isLoss(diceRoll)) {
    status = 2;
    drawLoss();
  }
}

// draw losing game splash
function drawLoss()
{
  textAlign(CENTER);
  textSize(50);
  strokeWeight(6);
  fill(200,0,0);
  text("Sorry, you lose!",wt / 2, ht /2);
  strokeWeight(1);
}

// draw winning game splash
function drawWin()
{
  textAlign(CENTER);
  textSize(50);
  strokeWeight(6);
  fill(0,200,0);
  text("YOU WIN!",wt / 2, ht /2);
  strokeWeight(1);
}

// draws the given tile at the given index
function drawTile(index, tile) {
  var offset = Math.floor((wt / game.tiles.length) * 0.10);
  var xpos = Math.floor(wt / game.tiles.length) * index + offset;
  var ypos = Math.floor(ht / 3);
  var w = Math.floor((wt / game.tiles.length) * 0.95);
  var h = -(Math.floor(ht / 3));

  // draw a squatty tile if it has been dropped
  if (tile.isDown) {
    ypos = 0;
    h = Math.floor(ht / 10);
  }

  // change tile color if it can be played and the mouse is on top of it
  fill(139, 69, 19);
  if (tileIsSelected(tile)) {
    fill(180, 90, 24);
  }

  rect(xpos, ypos, w, h);

  // if the tile hasn't been dropped, draw its value
  if (!tile.isDown) {
    textAlign(CENTER);
    fill(0, 0, 0);
    textSize(30);
    text(tile.tileNumber, xpos + (w / 2), ypos + (h / 2));
  }
}

// returns whether the tile is selected
// tiles aren't selected if they are dropped
// tiles aren't selected unless the state of the game allows it
// tiles aren't selected unless they are part of a valid play
function tileIsSelected(tile) {
  if (tile.isDown) {
    return false;
  } else if (status != 1) {
    return false;
  } else if (tileIsInAvailablePlay(tile.tileNumber)) {
    var availablePlay = getAvailablePlayForTile(tile.tileNumber);
    var isSelected = false;
    for (var i = 0; i < availablePlay.length; i++) {
      if (mouseIsOnTile(availablePlay[i])) {
        isSelected = true;
      }
    }
    return isSelected;
  } else {
    return false;
  }
}

// given a tile number, determine if it is part of an available play
function tileIsInAvailablePlay(tileNumber) {
  for (var i = 0; i < availablePlays.length; i++) {
    for (var j = 0; j < availablePlays[i].length; j++) {
      if (availablePlays[i][j] == tileNumber) {
        return true;
      }
    }
  }
  return false;
}

// retrieve the available play for a given tile
function getAvailablePlayForTile(tileNumber) {
  for (var i = 0; i < availablePlays.length; i++) {
    for (var j = 0; j < availablePlays[i].length; j++) {
      if (availablePlays[i][j] == tileNumber) {
        return availablePlays[i];
      }
    }
  }
  return [];
}

// determine if the mouse is on the given tilenumber
function mouseIsOnTile(tileNumber) {
  var index = tileNumber - 1;

  var offset = Math.floor((wt / game.tiles.length) * 0.10);
  var xpos = Math.floor(wt / game.tiles.length) * index + offset;
  var ypos = Math.floor(ht / 3);
  var w = Math.floor((wt / game.tiles.length) * 0.95);
  var h = -(Math.floor(ht / 3));

  return ((mouseX >= xpos) && (mouseX <= (xpos + w))) &&
    ((mouseY <= ypos) && (mouseY >= ypos + h));
}

// draws the roll dice button in the bottom right of the canvas
function drawDiceButton() {
  fill(210, 210, 210);
  if (diceButtonSelected()) {
    fill(230, 230, 230);
  }
  rect(wt * 0.01, ht * 0.90, wt * 0.15, ht * 0.09);

  textAlign(CENTER);
  fill(0, 0, 0);
  textSize(20);
  text("Roll", wt * 0.08, ht * 0.94);
  text("Dice", wt * 0.08, ht * 0.98);
}

// determines if the roll dice button is selected
function diceButtonSelected() {
  return ((mouseX >= (wt * 0.01) && mouseX <= (wt * 0.15)) &&
    (mouseY >= (ht * 0.90) && mouseY <= (ht * 0.99)) &&
    (status == 0));
}

// if the device is shaken and the game allows it, roll the dice
function deviceShaken(){
  if (status == 0) {
    rollDice();
  }
}

// handle mouse presses to roll dice, play a move, or restart the game
function mousePressed() {
  if (diceButtonSelected()) {
    rollDice();
  } else if (status == 1) {
    playMove();
  } else if (status == 2) {
    restartGame();
  }
}

// restarts the game
function restartGame()
{
  status = 0;
  diceRoll = [];
  dice = [];
  availablePlays = [];
  game = new Game(12,2,2);
}

// plays the given move
function playMove() {
  var movePlayed = false;
  for (var i = 0; i < game.tiles.length; i++) {
    if (tileIsSelected(game.tiles[i])) {
      game.tiles[i].dropTile();
      movePlayed = true;
    }
  }
  if (movePlayed) {
    status = 0;
  }
}

// rolls dice
function rollDice() {
  status = 1;
  diceRoll = game.getDiceRoll();
  initiateDice();
  availablePlays = game.getAvailablePlays(diceRoll);
}

// initiates dice objects for drawing later
function initiateDice() {
  dice = [];
  for (var i = 0; i < diceRoll.length; i++) {
    dice.push(new Die(diceRoll[i], wt, ht));
  }
}

// draw the current dice objects
function drawDice() {
  for (var i = 0; i < dice.length; i++) {
    drawOneDie(dice[i]);
  }
}

// draw the given die object
function drawOneDie(die) {
  fill(255, 255, 255);
  rectMode(CENTER);
  rect(die.xpos, die.ypos, die.w, die.w, die.r);
  drawDieFace(die);
  rectMode(CORNER);
}

// draws the die face of the given die object
function drawDieFace(die) {
  fill(0, 0, 0);
  var r = wt * 0.012;
  switch (die.number) {
    case 1:
      ellipse(die.xpos, die.ypos, r, r);
      break;
    case 2:
      ellipse(die.xpos - (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos + (die.w / 4), r, r);
      break;
    case 3:
      ellipse(die.xpos - (die.w / 4), die.ypos - (die.w / 5), r, r);
      ellipse(die.xpos, die.ypos, r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos + (die.w / 5), r, r);
      break;
    case 4:
      ellipse(die.xpos - (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos - (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos - (die.w / 4), r, r);
      break;
    case 5:
      ellipse(die.xpos - (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos - (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos, die.ypos, r, r);
      break;
    case 6:
      ellipse(die.xpos - (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos - (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos, r, r);
      ellipse(die.xpos - (die.w / 4), die.ypos, r, r);
      break;
  }
}
