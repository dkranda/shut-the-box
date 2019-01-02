class Game {
  constructor(numTiles, numDice, numSum) {
    this.numTiles = numTiles;
    this.numDice = numDice;
    this.numSum = numSum;
    this.movesLeft = true;
    this.tiles = [];
    for (var i = 0; i < numTiles; i++) {
      this.tiles.push(new Tile(i + 1));
    }
  }

  getDiceRoll() {
    var diceRoll = [];
    for (var i = 0; i < this.numDice; i++) {
      diceRoll.push(Math.floor(Math.random() * 6) + 1);
    }
    return diceRoll;
  }

  getScore() {
    var score = 0;
    for (var i = 0; i < this.tiles.length; i++) {
      if (!this.tiles[i].isDown) {
        score += this.tiles[i].tileNumber;
      }
    }
    return score;
  }

  getAvailablePlays(diceRoll) {
    var diceTotal = 0;
    var availablePlays = [];

    var prevDie;
    var sameDie = true;

    for (var i = 0; i < diceRoll.length; i++) {
      diceTotal += diceRoll[i];

      if (i > 0) {
        if (prevDie != diceRoll[i]) {
          sameDie = false;
        }
      }
      prevDie = diceRoll[i];
    }

    if (sameDie && this.isTileAvailable(prevDie)) {
      availablePlays.push([prevDie]);
    }

    for (var i = 0; i < this.tiles.length; i++) {
      var tileNum = this.tiles[i].tileNumber;
      if (!this.tiles[i].isDown && (tileNum == diceTotal)) {
        availablePlays.push([tileNum]);
      } else if (!this.tiles[i].isDown && (tileNum < diceTotal)) {
        var play = [tileNum];
        this.addPlay(play, diceTotal - tileNum, availablePlays);
      }
    }

    return availablePlays;
  }

  addPlay(currentPlay, currentTotal, availablePlays) {
    var playCopy = [];
    for (var i = 0; i < this.tiles.length; i++) {
      var tileNum = this.tiles[i].tileNumber;
      if (this.tiles[i].isDown) {
        continue; // already down; can't use it
      } else if (currentPlay.indexOf(tileNum) >= 0) {
        continue; // already part of this move; can't add it again
      } else if (tileNum > currentTotal) {
        continue; // doesn't add up correctly
      } else if (tileNum == currentTotal) {
        playCopy = currentPlay.slice();
        playCopy.push(tileNum);
        if (playCopy.length <= this.numSum) {
          availablePlays.push(playCopy); // adds up correctly, and isn't too big of a combo
        }
      } else {
        playCopy = currentPlay.slice();
        playCopy.push(tileNum);
        this.addPlay(playCopy, currentTotal - tileNum, availablePlays); // adds up okay, but not there yet
      }
    }
  }

  isTileAvailable(tileNum,tile)
  {
    for (var i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].tileNumber == tileNum && !this.tiles[i].isDown)
      {
        return true;
      }
    }
    return false;
  }

  playMove(tilesToPlay)
  {
    var tilesPlayed = 0;
    for (var i = 0; i < this.tiles.length; i++) {
      var tileNum = this.tiles[i].tileNumber;
      if (this.tiles[i].isDown) {
        continue;
      } else if (tilesToPlay.indexOf(tileNum) < 0){
        continue;
      }
      else {
        tilesPlayed++;
        this.tiles[i].dropTile();
      }
    }
    return (tilesPlayed == tilesToPlay.length);
  }

  isWin() {
    return (this.getScore() == 0);
  }

  isLoss(diceRoll) {
    var availablePlays= [];
    availablePlays = this.getAvailablePlays(diceRoll);
    return (availablePlays.length == 0);
  }

  showGame()
  {
    console.log("score: " + this.getScore());
    console.log(this.tiles);
  }
}
