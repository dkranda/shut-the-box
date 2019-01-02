class Tester {
  constructor() {}

  testMethods(numberOfGames)
  {
    // highest
    this.testOneMethod(numberOfGames,0);

    // random
    this.testOneMethod(numberOfGames,1);

    // highest v2
    this.testOneMethod(numberOfGames,2);

    // lowest
    this.testOneMethod(numberOfGames,3);
  }

  testOneMethod(numberOfGames,mode)
  {
    var game;
    var wins = 0;
    var losses = 0;
    var scoreTotal = 0;
    var modeString;

    switch (mode) {
      case 0:
        modeString = "highest";
        break;
      case 1:
        modeString = "random";
        break;
      case 2:
        modeString = "highest v2";
        break;
      case 3:
        modeString = "lowest";
        break;
      default:
        modeString = "oops";
        break;
    }

    for (var i = 0; i < numberOfGames; i++) {
      game = new Game(9,2,2);
      if (this.playGame(game,0,mode))
      {
        wins++;
      }
      else {
        losses++;
      }
      scoreTotal += game.getScore();
    }

    console.log("-------------------");
    console.log(modeString + " results");
    console.log("wins: " + wins);
    console.log("losses: " + losses);
    console.log("average: " + Math.floor(scoreTotal / numberOfGames));
    console.log("-------------------");
  }

  playGame(game, debug, mode) {
    if (game.numSum != 2) {
      if (debug) {
        console.log("only works with 2 factor games")
        game.showGame();
      }
      return false;
    }
    if (game.isWin()) {
      if (debug) {
        console.log("win");
        game.showGame();
      }
      return true;
    } else {
      var diceRoll = game.getDiceRoll();
      if (game.isLoss(diceRoll)) {
        if (debug) {
          console.log("loss");
          game.showGame()
        }
        return false;
      }
      var plays = game.getAvailablePlays(diceRoll);
      var play = this.pickPlay(plays, mode);
      if (!game.playMove(play)) {
        if (debug) {
          console.log("no moves, loss");
          game.showGame()
        }
        return false;
      }
      return this.playGame(game,debug,mode);
    }
  }

  pickPlay(plays, mode) {
    switch (mode) {
      case 0:
        return this.getHighPlay(plays);
      case 1:
        return this.getRandomPlay(plays)
      case 2:
        return this.getHighPlayV2(plays);
      case 3:
        return this.getLowPlay(plays);
    }
  }

  getHighPlay(plays) {
    var highSingle = [];
    var high = 0;
    var highPair = [];
    var highDiff = 100;

    for (var i = 0; i < plays.length; i++) {
      if (plays[i].length == 1) {
        if (plays[i][0] > high) {
          highSingle = plays[i];
          high = plays[i][0];
        }
      } else {
        var diff = Math.abs(plays[i][0] - plays[i][1]);
        if (diff < highDiff) {
          highPair = plays[i];
          highDiff = diff;
        }
      }
    }

    if (highSingle.length == 1) {
      return highSingle;
    } else {
      return highPair;
    }
  }

  getHighPlayV2(plays) {
    var highSingle = [];
    var high = 0;
    var highPair = [];
    var highDiff = 0;

    for (var i = 0; i < plays.length; i++) {
      if (plays[i].length == 1) {
        if (plays[i][0] > high) {
          highSingle = plays[i];
          high = plays[i][0];
        }
      } else {
        var diff = Math.abs(plays[i][0] - plays[i][1]);
        if (diff > highDiff) {
          highPair = plays[i];
          highDiff = diff;
        }
      }
    }

    if (highSingle.length == 1) {
      return highSingle;
    } else {
      return highPair;
    }
  }

  getLowPlay(plays) {
    var lowSingle = [];
    var low = 9999;
    var lowPair = [];
    var lowDiff = 0;

    for (var i = 0; i < plays.length; i++) {
      if (plays[i].length == 1) {
        if (plays[i][0] < low) {
          lowSingle = plays[i];
          low = plays[i][0];
        }
      } else {
        var diff = Math.abs(plays[i][0] - plays[i][1]);
        if (diff > lowDiff) {
          lowPair = plays[i];
          lowDiff = diff;
        }
      }
    }

    if (lowSingle.length == 1) {
      return lowSingle;
    } else {
      return lowPair;
    }
  }

  getRandomPlay(plays) {
    var playIndex = Math.floor(Math.random() * plays.length);
    return plays[playIndex];
  }
}
