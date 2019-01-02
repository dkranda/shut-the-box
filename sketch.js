var wt = 500;
var ht = 500;
var game;
var status = 0;
var diceRoll = [];
var dice = [];
var availablePlays = [];

function setup() {
  createCanvas(wt, ht);
  game = new Game(12, 2, 2)
}

function draw() {
  clear();
  background(51);
  drawGame();
  drawScore();
  drawDiceButton();
  drawDice();
  checkGame();
}

function drawGame() {
  for (var i = 0; i < game.tiles.length; i++) {
    this.drawTile(i, game.tiles[i]);
  }
}

function drawScore()
{
  textSize(20);
  fill(255,255,255);
  text("Score: " + game.getScore(),wt * 0.90, ht * 0.98);
}

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

function drawLoss()
{
  textAlign(CENTER);
  textSize(50);
  strokeWeight(6);
  fill(200,0,0);
  text("Sorry, you lose!",wt / 2, ht /2);
  strokeWeight(1);
}

function drawWin()
{
  textAlign(CENTER);
  textSize(50);
  strokeWeight(6);
  fill(0,200,0);
  text("YOU WIN!",wt / 2, ht /2);
  strokeWeight(1);
}

function drawTile(index, tile) {
  var offset = Math.floor((wt / game.tiles.length) * 0.10);
  var xpos = Math.floor(wt / game.tiles.length) * index + offset;
  var ypos = Math.floor(ht / 3);
  var w = Math.floor((wt / game.tiles.length) * 0.95);
  var h = -(Math.floor(ht / 3));

  if (tile.isDown) {
    ypos = 0;
    h = Math.floor(ht / 10);
  }

  fill(139, 69, 19);
  if (tileIsSelected(tile)) {
    fill(180, 90, 24);
  }

  rect(xpos, ypos, w, h);

  if (!tile.isDown) {
    textAlign(CENTER);
    fill(0, 0, 0);
    textSize(30);
    text(tile.tileNumber, xpos + (w / 2), ypos + (h / 2));
  }
}

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

function diceButtonSelected() {
  return ((mouseX >= (wt * 0.01) && mouseX <= (wt * 0.15)) &&
    (mouseY >= (ht * 0.90) && mouseY <= (ht * 0.99)) &&
    (status == 0));
}

function mouseClicked() {
  if (diceButtonSelected()) {
    rollDice();
  } else if (status == 1) {
    playMove();
  } else if (status == 2) {
    restartGame();
  }
}

function restartGame()
{
  status = 0;
  diceRoll = [];
  dice = [];
  availablePlays = [];
  game = new Game(12,2,2);
}

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

function rollDice() {
  status = 1;
  diceRoll = game.getDiceRoll();
  initiateDice();
  availablePlays = game.getAvailablePlays(diceRoll);
}

function initiateDice() {
  dice = [];
  for (var i = 0; i < diceRoll.length; i++) {
    dice.push(new Die(diceRoll[i], wt, ht));
  }
}

function drawDice() {
  for (var i = 0; i < dice.length; i++) {
    drawOneDie(dice[i]);
  }
}

function drawOneDie(die) {
  fill(255, 255, 255);
  rectMode(CENTER);
  rect(die.xpos, die.ypos, die.w, die.w);
  drawDieFace(die);
  rectMode(CORNER);
}

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
