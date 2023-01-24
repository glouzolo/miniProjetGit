document.getElementById("play").addEventListener("click", function() { gameTicTacToe.gameModeSelect() });

document.querySelector("body").addEventListener("click", function() {
  if (event.target.id == "onePlayer") {
    gameTicTacToe.onePlayerGame();
  }
});

document.querySelector("body").addEventListener("click", function() {
  if (event.target.id == "twoPlayers") {
    gameTicTacToe.twoPlayersGame();
  }
});

document.querySelector("body").addEventListener("click", function()
{ for (var i = 1; i < 10; i++) {
       var eventId = "s" + i;

       if (event.target.id == eventId) {
         var success = gameTicTacToe.selectSquare(eventId, i);
         if (success) {
            gameTicTacToe.checkGameState();
            gameTicTacToe.computerMode();
         }
      }
   }
});

document.querySelector("body").addEventListener("click", function() {
  if (event.target.id == "winResult") {
    gameTicTacToe.displayResults();
  }
});

document.querySelector("body").addEventListener("click", function() {
  if (event.target.id == "Close") {
    gameTicTacToe.goBack();
  }
});
document.querySelector("body").addEventListener("click", function() {
  if (event.target.id == "gameReset") {
    gameTicTacToe.resetGame();
  }
});
