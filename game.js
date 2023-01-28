var gameTicTacToe = (function () {
  var xUser, oUser; //store users' name and results
  var firstTime = true; //define a symbol if the users play this game at first time
  var squareMatrix; //define a matrix of square
  var xUserTurn; //define an judgement if it trun to "X" user
  var isFirstRound; //define a symbol of first round
  var step; //define the step of game
  var sign; //sign is on behalf of "X" or "O"
  var signColor; //define the color of sign
  var onePlayerMode; //define the game mode, one player or two players
  var computerFirst;

  var computerAI = (function () {
    var checkCorner = function () {
      //to check if corners are occupied by computer or human and if human occupied a pair of diagonal corner
      var xOccupy = false;
      var oOccupy = false;
      var oDiagnoal = false;
      if (
        squareMatrix[0] == 1 ||
        squareMatrix[2] == 1 ||
        squareMatrix[6] == 1 ||
        squareMatrix[8] == 1
      ) {
        xOccupy = true;
      }
      if (
        squareMatrix[0] == -1 ||
        squareMatrix[2] == -1 ||
        squareMatrix[6] == -1 ||
        squareMatrix[8] == -1
      ) {
        oOccupy = true;
      }
      if (oOccupy) {
        if (
          (squareMatrix[0] == -1 && squareMatrix[8] == -1) ||
          (squareMatrix[2] == -1 && squareMatrix[6] == -1)
        ) {
          oDiagnoal = true;
        }
      }
      return [xOccupy, oOccupy, oDiagnoal];
    };

    var occupyCorner = function () {
      //occupy any corner
      for (var i = 0; i < 9; i++) {
        if (squareMatrix[i] == 0 && (i == 0 || i == 2 || i == 6 || i == 8)) {
          return i + 1;
        }
      }
      return false;
    };

    var occupyDiagnoalCorner = function () {
      // //occupy a diagonal corner
      for (var i = 0; i < 9; i++) {
        if (squareMatrix[i] == 0 && (i == 0 || i == 2 || i == 6 || i == 8)) {
          //if  one corner is availble, check if it's diagonalCorner is occupied by computer
          var diagonalCorner = 8 - i;
          if (squareMatrix[diagonalCorner] == 1) {
            return i + 1;
          }
        }
      }
      return false;
    };

    var occupySquare = function () {
      //occupy any square
      for (var i = 0; i < 9; i++) {
        if (squareMatrix[i] == 0) {
          return i + 1;
        }
      }
      return false;
    };

    var occupySameSideCorner = function () {
      //if computer has occupied one corner, and the other 2 squares on the same line are available,
      var sameSide1, sameSide2, middle1, middle2; //occupy the corner on the other end of this line.
      for (var i = 0; i < 9; i++) {
        if (squareMatrix[i] == 1 && (i == 0 || i == 2 || i == 6 || i == 8)) {
          //if one corner is occupied by computer
          if (i + 2 > 8 || i + 2 == 4) {
            //find the two corners which are on the other end of lines.
            sameSide1 = i - 2;
          } else {
            sameSide1 = i + 2;
          }
          if (i + 6 > 8) {
            sameSide2 = i - 6;
          } else {
            sameSide2 = i + 6;
          }
          middle1 = (i + sameSide1) / 2; //find the square between these 2 corners.
          middle2 = (i + sameSide2) / 2;

          if (squareMatrix[sameSide1] == 0 && squareMatrix[middle1] == 0) {
            return sameSide1 + 1;
          }
          if (squareMatrix[sameSide2] == 0 && squareMatrix[middle2] == 0) {
            return sameSide2 + 1;
          }
        }
      }
      return false;
    };

    var checkComputerWin = function () {
      //to check if computer will win in the next step.
      var winFlag;
      for (var i = 0; i < 9; i++) {
        //first step, check if computer can win if one square is clicked
        if (squareMatrix[i] == 0) {
          //the square is availble
          squareMatrix[i] = 1; //assume computer clicks this square, put value 1 to matrix id
          winFlag = checkWin()[0]; //check if computer wins
          squareMatrix[i] = 0; //reset this square to empty
          if (winFlag) {
            return i + 1; //if win, return the square id = matrix id + 1
          }
        }
      }
      return false;
    };

    var checkHumanWin = function () {
      //to check if human will win in the next step
      var WinFlag;
      for (var i = 0; i < 9; i++) {
        if (squareMatrix[i] == 0) {
          squareMatrix[i] = -1;
          winFlag = checkWin()[0];
          squareMatrix[i] = 0;
          if (winFlag) {
            return i + 1; //if win, return the square id = matrix id + 1
          }
        }
      }
      return false;
    };

    var tryOccupyCorner = function () {
      //this function defines the strategy how the computer occupies the corner.
      var cornerOccupyFlag;
      cornerOccupyFlag = occupyDiagnoalCorner();
      if (cornerOccupyFlag) {
        return cornerOccupyFlag;
      }
      cornerOccupyFlag = occupySameSideCorner();
      if (cornerOccupyFlag) {
        return cornerOccupyFlag;
      }
      cornerOccupyFlag = occupyCorner();
      if (cornerOccupyFlag) {
        return cornerOccupyFlag;
      }
    };

    var computerThink = function () {
      //computer makes a decision from this function

      var xCornerOccupy = checkCorner()[0];
      var oCornerOccupy = checkCorner()[1];
      var oDiagnoalOccupt = checkCorner()[2];
      var centerOccupy = squareMatrix[4];
      var tryCornerlFlag;

      var computerWinFlag = checkComputerWin(); // 1. check wether computer will win if computer clicks this square
      if (computerWinFlag) {
        //if yes, return this value to ensure computer wins in next step
        return computerWinFlag;
      }

      var humanWinFlag = checkHumanWin(); //2. check wether human will win if human clicks this square
      if (humanWinFlag) {
        //if yes, return this value to prevent computer from winning in next step
        return humanWinFlag;
      }
      //3 if no one can win
      if (xCornerOccupy) {
        //check if computer has occupied at least one corner

        if (oCornerOccupy) {
          //if human has occupied one corner
          tryCornerlFlag = tryOccupyCorner(); // using strategy to occupy one corner(diagnoal corner first)
          if (tryCornerlFlag) {
            return tryCornerlFlag;
          }
        }

        if (centerOccupy == 0) {
          // check if center square is available.
          return 5; //if yes, occupy it.
        } else {
          tryCornerlFlag = tryOccupyCorner(); // try occupying other corner
          if (tryCornerlFlag) {
            return tryCornerlFlag;
          }
          return occupySquare(); //if can not occupy anyone corner, occupy anyone square
        }
      } else {
        //if computer does not occupy any corner, occupy one corner
        if (oCornerOccupy && !computerFirst) {
          //check if human has occupied at least one corner and is the first player
          if (!centerOccupy) {
            //if yes, occupy the center
            return 5;
          }
          if (oDiagnoalOccupt) {
            //if human has occupied a pair of diagnoal corners, occupied square 4 or square 6
            if (squareMatrix[4] == 1 && squareMatrix[3] == 0) {
              return 4;
            }
            if (squareMatrix[4] == 1 && squareMatrix[5] == 0) {
              return 6;
            }
          }
        }
        tryCornerlFlag = tryOccupyCorner();
        if (tryCornerlFlag) {
          return tryCornerlFlag;
        }
      }
    };
    return {
      computerThink: computerThink,
    };
  })();

  var gameModeSelect = function () {
    //select a gmae mode, 1 player or 2 players

    var welcomeDiv = document.getElementById("welcome");
    welcomeDiv.parentNode.removeChild(welcomeDiv);

    var modeSelectDiv = document.createElement("div");
    modeSelectDiv.setAttribute("id", "mode");
    modeSelectDiv.setAttribute("class", "welcome");

    var modeMessage = document.createElement("h4");
    modeMessage.innerHTML = "Please select a mode";

    var onePlayerBtn = document.createElement("button");
    onePlayerBtn.setAttribute("id", "onePlayer");
    onePlayerBtn.setAttribute("class", "btn btn-success");
    onePlayerBtn.innerHTML = "One Player";

    var twoPlayersBtn = document.createElement("button");
    twoPlayersBtn.setAttribute("id", "twoPlayers");
    twoPlayersBtn.setAttribute("class", "btn btn-success");
    twoPlayersBtn.innerHTML = "Two Players";

    modeSelectDiv.appendChild(modeMessage);
    modeSelectDiv.appendChild(onePlayerBtn);
    modeSelectDiv.appendChild(twoPlayersBtn);

    document.body.appendChild(modeSelectDiv);
  };

  var onePlayerGame = function () {
    var modeDiv = document.getElementById("mode");
    modeDiv.parentNode.removeChild(modeDiv);
    onePlayerMode = true;
    initGame();
  };

  var twoPlayersGame = function () {
    var modeDiv = document.getElementById("mode");
    modeDiv.parentNode.removeChild(modeDiv);
    onePlayerMode = false;
    initGame();
  };

  var getUserInfo = function () {
    var xUserName, oUserName;

    if (onePlayerMode) {
      xUserName = "Super Maria";
      oUserName = prompt("Please enter O's player name");
    } else {
      xUserName = prompt("Please enter X's player name");
      oUserName = prompt("Please enter O's player name");
    }

    if (xUserName == oUserName) {
      do {
        oUserName = prompt(
          "O's player name cannot be the same as X's player's name, please enter O's player name"
        );
      } while (xUserName == oUserName);
    }

    xUser = {
      name: xUserName,
      gameResults: [0, 0, 0],
    };

    oUser = {
      name: oUserName,
      gameResults: [0, 0, 0],
    };
  };

  var generateGameBoard = function () {
    var gameDiv = document.createElement("div");
    var gameTitle = document.createElement("div");
    var gameMetrix = document.createElement("div");
    var gameInfo = document.createElement("div");

    gameDiv.setAttribute("id", "game");
    gameDiv.setAttribute("class", "pattern");

    //gameTitle.setAttribute("id", "title");
    gameTitle.setAttribute("class", "title");
    gameTitle.innerHTML = "Tic Tac Toe";
    gameMetrix.setAttribute("id", "metrix");
    gameInfo.setAttribute("id", "info");

    for (var i = 1; i < 10; i++) {
      //to create 9 squares
      var square = document.createElement("div");
      square.setAttribute("id", "s" + i);
      square.setAttribute("class", "square clear");
      gameMetrix.appendChild(square);
    }

    var turnStatus = document.createElement("h2");
    var symbolStatus = document.createElement("span");
    var currentUser = document.createElement("span");
    var mode = document.createElement("h3");

    turnStatus.setAttribute("id", "turn");
    turnStatus.innerHTML = "Turn -  ";
    symbolStatus.setAttribute("id", "symbol");
    currentUser.setAttribute("id", "currentUser");
    turnStatus.appendChild(symbolStatus);
    turnStatus.appendChild(currentUser);

    mode.innerHTML = onePlayerMode ? "Solo" : "Multijoueur";

    gameInfo.appendChild(turnStatus);
    gameInfo.appendChild(mode);
    gameDiv.appendChild(gameTitle);
    gameDiv.appendChild(gameMetrix);
    gameDiv.appendChild(gameInfo);

    document.body.appendChild(gameDiv);
  };

  var initGame = function () {
    if (firstTime) {
      //get users information if it is the first time
      getUserInfo();
      firstTime = false; //change first time status after getting users information
    }

    isFirstRound = true; //game will start with isFirstRound
    step = 0; //initialize game step
    squareMatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    generateGameBoard();
    nextRound();
    if (onePlayerMode) {
      if (computerFirst) {
        var firstStep = firstGo();
        var firstSquare = "s" + firstStep;
        var action = selectSquare(firstSquare, firstStep);
        //computerFirst = false;
        checkGameState();
      }
    }
  };

  var getFirstPlayer = function () {
    var randomNumber = Math.floor(Math.random() * 10 + 1);
    if (randomNumber % 2) {
      return "X";
    } else {
      return "O";
    }
  };

  var nextRound = function () {
    var currentName;
    if (isFirstRound) {
      //if it is the first round, choose the first player randomly

      var firstPlayer = getFirstPlayer();

      if (firstPlayer == "X") {
        xUserTurn = true;
        computerFirst = true;
      } else {
        xUserTurn = false;
        computerFirst = false;
      }

      isFirstRound = false;
    }

    if (xUserTurn) {
      //define sign, color of sign, "X" user name in "X" user's turn
      sign = "X";
      signColor = "chartreuse";
      currentName = xUser.name;
    } else {
      //define sign, color of sign, "O" user name in "O" user's turn
      sign = "O";
      signColor = "red";
      currentName = oUser.name;
    }
    /* display current user's information */
    var turnSymbol = document.getElementById("symbol");
    var turnUser = document.getElementById("currentUser");
    turnSymbol.style.color = signColor;
    turnSymbol.innerHTML = sign + " :  ";
    turnUser.innerHTML = currentName;
  };

  var computerMode = function () {
    //computer will act as 'X' user in this game.
    if (onePlayerMode) {
      if (xUserTurn) {
        computerAction();
        checkGameState();
      }
    }
  };

  var computerAction = function () {
    //the action the computer plays

    var computerSelect = computerAI.computerThink(); //from function computerThink, computer decides which square it will occupy in this round
    var squareNumber = "s" + computerSelect;
    var action = selectSquare(squareNumber, computerSelect); //after making a decision, select the target
  };

  var firstGo = function () {
    //if computer first, this function is to decide which square computer will click
    var randomNumber = Math.floor(Math.random() * 10 + 1); //in the first step
    if (randomNumber < 6) {
      if (randomNumber % 2 == 0) {
        return 1;
      } else {
        return 3;
      }
    } else {
      if (randomNumber % 2 == 0) {
        return 7;
      } else {
        return 9;
      }
    }
  };

  var selectSquare = function (squareId, recordNumber) {
    var id = recordNumber - 1; //find the item in square matrix
    if (squareMatrix[id] != 0) {
      //if square is not empty, alert an error message and return false
      alert("This position is not availble, please select another position");
      return false;
    } else {
      //if square is empty, put the record to square matrix
      var squareItem = document.getElementById(squareId);

      if (sign == "X") {
        squareMatrix[id] = 1; //if "X" user, put 1 in square matrix
      } else {
        squareMatrix[id] = -1; //if "O" user, put -1 in square matrix
      }
      //put symbol inside the square and return true
      squareItem.style.color = signColor;
      squareItem.innerHTML = sign;
      return true;
    }
  };

  var checkWin = function () {
    if (Math.abs(squareMatrix[0] + squareMatrix[1] + squareMatrix[2]) == 3) {
      return [true, "metrix3"];
    } else if (
      Math.abs(squareMatrix[3] + squareMatrix[4] + squareMatrix[5]) == 3
    ) {
      return [true, "metrix4"];
    } else if (
      Math.abs(squareMatrix[6] + squareMatrix[7] + squareMatrix[8]) == 3
    ) {
      return [true, "metrix5"];
    } else if (
      Math.abs(squareMatrix[0] + squareMatrix[3] + squareMatrix[6]) == 3
    ) {
      return [true, "metrix6"];
    } else if (
      Math.abs(squareMatrix[1] + squareMatrix[4] + squareMatrix[7]) == 3
    ) {
      return [true, "metrix7"];
    } else if (
      Math.abs(squareMatrix[2] + squareMatrix[5] + squareMatrix[8]) == 3
    ) {
      return [true, "metrix8"];
    } else if (
      Math.abs(squareMatrix[0] + squareMatrix[4] + squareMatrix[8]) == 3
    ) {
      return [true, "metrix1"];
    } else if (
      Math.abs(squareMatrix[2] + squareMatrix[4] + squareMatrix[6]) == 3
    ) {
      return [true, "metrix2"];
    } else {
      return [false, "none"];
    }
  };

  var checkGameState = function () {
    var win = checkWin()[0];
    var way = checkWin()[1];

    if (win) {
      //if someone wins, draw a  line to connect the 3 squares.
      drawingLine(way);

      if (xUserTurn) {
        xUser.gameResults[0] += 1;
        oUser.gameResults[2] += 1;
        var t = setTimeout(promptWinner, 1000, xUser.name, win);
      } else {
        oUser.gameResults[0] += 1;
        xUser.gameResults[2] += 1;
        var t = setTimeout(promptWinner, 1000, oUser.name, win);
      }
    } else {
      if (step < 8) {
        //if no one wins and it is not the last round, continue next round
        step += 1;
        xUserTurn = !xUserTurn;
        nextRound();
      } else {
        //if it is the last round and no one wins, display a tie
        oUser.gameResults[1] += 1;
        xUser.gameResults[1] += 1;
        var t = setTimeout(promptWinner, 500, "No one", win);
      }
    }
  };

  var drawingLine = function (showList) {
    //to draw a line to connect the 3 squares

    var lineDiv = document.createElement("div");
    var metrixDiv = document.getElementById("metrix");
    lineDiv.setAttribute("class", showList);
    metrixDiv.appendChild(lineDiv);
  };

  var promptWinner = function (winnerName, result) {
    //to prompt a window to show the result of this match.

    var x = document.getElementById("game");
    x.parentNode.removeChild(x);

    var winDiv = document.createElement("div");
    var winMessage = document.createElement("h3");
    var buttonResult = document.createElement("BUTTON");
    var buttonReset = document.createElement("BUTTON");

    winDiv.setAttribute("id", "win");
    winMessage.setAttribute("id", "winMessage");
    buttonResult.setAttribute("class", "btn btn-success");
    buttonResult.setAttribute("id", "winResult");
    buttonReset.setAttribute("class", "btn btn-warning");
    buttonReset.setAttribute("id", "gameReset");

    if (result) {
      //if wins, show who wins
      winMessage.innerHTML = winnerName + " wins";
    } else {
      //if no one wins, show a tie
      winMessage.innerHTML = "The match ended in a tie";
    }
    buttonResult.innerHTML = "Display Result";
    buttonReset.innerHTML = "Game Reset";

    winDiv.appendChild(winMessage);
    winDiv.appendChild(buttonResult);
    winDiv.appendChild(buttonReset);
    document.body.appendChild(winDiv);
  };

  var displayResults = function () {
    var resultDiv = document.createElement("div");
    resultDiv.setAttribute("id", "result");

    var resultTable = document.createElement("table");
    resultTable.setAttribute("id", "resultTable");
    resultTable.setAttribute("class", "table table-striped");

    var resultHead = document.createElement("tr");

    var nameCell = document.createElement("th");
    nameCell.innerHTML = "Name";

    var winCell = document.createElement("th");
    winCell.innerHTML = "Win";

    var tieCell = document.createElement("th");
    tieCell.innerHTML = "Tie";

    var lossCell = document.createElement("th");
    lossCell.innerHTML = "Loss";

    resultHead.appendChild(nameCell);
    resultHead.appendChild(winCell);
    resultHead.appendChild(tieCell);
    resultHead.appendChild(lossCell);
    resultTable.appendChild(resultHead);

    var xUserLine = document.createElement("tr");
    var xNameCell = document.createElement("td");
    xNameCell.innerHTML = xUser.name;
    var xUserWins = document.createElement("td");
    xUserWins.innerHTML = xUser.gameResults[0];
    var xUserTies = document.createElement("td");
    xUserTies.innerHTML = xUser.gameResults[1];
    var xUserLoss = document.createElement("td");
    xUserLoss.innerHTML = xUser.gameResults[2];

    xUserLine.appendChild(xNameCell);
    xUserLine.appendChild(xUserWins);
    xUserLine.appendChild(xUserTies);
    xUserLine.appendChild(xUserLoss);
    resultTable.appendChild(xUserLine);

    var oUserLine = document.createElement("tr");
    var oNameCell = document.createElement("td");
    oNameCell.innerHTML = oUser.name;
    var oUserWins = document.createElement("td");
    oUserWins.innerHTML = oUser.gameResults[0];
    var oUserTies = document.createElement("td");
    oUserTies.innerHTML = oUser.gameResults[1];
    var oUserLoss = document.createElement("td");
    oUserLoss.innerHTML = oUser.gameResults[2];

    oUserLine.appendChild(oNameCell);
    oUserLine.appendChild(oUserWins);
    oUserLine.appendChild(oUserTies);
    oUserLine.appendChild(oUserLoss);
    resultTable.appendChild(oUserLine);

    var returnButton = document.createElement("button");
    returnButton.setAttribute("id", "Close");
    returnButton.setAttribute("class", "btn btn-success");
    returnButton.innerHTML = "Close";

    resultDiv.appendChild(resultTable);
    resultDiv.appendChild(returnButton);

    document.getElementById("win").appendChild(resultDiv);
  };

  var goBack = function () {
    //to close result display
    var displayDiv = document.getElementById("result");
    displayDiv.parentNode.removeChild(displayDiv);
  };

  var resetGame = function () {
    var resultDisplay = document.getElementById("win");
    resultDisplay.parentNode.removeChild(resultDisplay);
    initGame();
  };

  return {
    gameModeSelect: gameModeSelect,
    onePlayerGame: onePlayerGame,
    twoPlayersGame: twoPlayersGame,
    computerMode: computerMode,
    selectSquare: selectSquare,
    checkGameState: checkGameState,
    displayResults: displayResults,
    goBack: goBack,
    resetGame: resetGame,
  };
})();
