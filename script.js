const game = (() => {
  // Create the 3x3 game board structure
  const gameBoard = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ];

  // Place a player's marker on the cell of their choice
  const updateGameBoard = (playerMarker, row, column) => {
    gameBoard[row][column] = playerMarker;
  };

  // Show the current game board
  const showGameBoard = () => gameBoard;

  // Module returns the following functions
  return {
    showGameBoard,
    updateGameBoard,
  };
})();

// Create a player object, using a factory function
const playerFactory = (name, marker) => ({
  name,
  marker,
});
// Create 2 players, each with their unique marker
const playerOne = playerFactory('Joe', 'O');
const playerTwo = playerFactory('Felix', 'X');
const players = [playerOne, playerTwo];

// Create a game controller object as a module
const gameController = (() => {
  let whoseTurn;
  // Check if the next turn can be taken, i.e. an empty cell is available

  const checkGameStatus = () => {
    const currentBoard = game.showGameBoard();
    const possibleWinCombinations = [];
    const gameStatus = {
      winner: undefined,
    };

    // Check if there's a tie
    const checkForTie = () => {
      for (let row = 0; row < currentBoard.length; row++) {
        for (let col = 0; col < currentBoard[row].length; col++) {
          if (!currentBoard[row][col]) {
            return;
          }
        }
      }
      // Assign null to gameStatus.winner if the game ends in a tie
      gameStatus.winner = null;
    };
    // Check if a player has won the game
    // Check for a "row win"
    for (let row = 0; row < currentBoard.length; row++) {
      possibleWinCombinations.push(currentBoard[row]);
    }
    // Check for a "column win"
    for (let col = 0; col < currentBoard[0].length; col++) {
      const extractColumns = (arr, n) => arr.map((x) => x[n]);
      possibleWinCombinations.push(extractColumns(currentBoard, col));
    }
    // Check for a "diagonal win"
    const topLeftDiag = [];
    const bottomLeftDiag = [];

    for (let row = 0; row < currentBoard.length; row++) {
      topLeftDiag.push(currentBoard[row][row]);
      bottomLeftDiag.push(currentBoard[row][currentBoard.length - 1 - row]);
    }
    possibleWinCombinations.push(topLeftDiag, bottomLeftDiag);

    // Assign the marker of the winner to the game status if there is one
    const checkForWinningCombination = (arr) => {
      arr.every((marker) => marker !== undefined && marker === arr[0]);
    };
    for (let i = 0; i < possibleWinCombinations.length; i++) {
      if (checkForWinningCombination(possibleWinCombinations[i])) {
        gameStatus.winner = possibleWinCombinations[i][0];
      }
    }

    checkForTie();

    return {
      gameStatus,
    };
  };

  const takeTurn = (player) => {
    // Update turn with current player
    whoseTurn = player;
    // Store the row and column of the player's selected cell in their respective variables
    const selectedRow = prompt(`Hi, ${player.name}, please select a row, 0-2.`);
    const selectedColumn = prompt(
      `Hi, ${player.name}, please select a column, 0-2.`,
    );
    // Update the game board
    game.updateGameBoard(player.marker, selectedRow, selectedColumn);
    // Check if game is over
    if (gameController.checkGameStatus().gameStatus.winner) {
      // Declare the winner
      console.log(
        `The winner plays with the marker ${
          gameController.checkGameStatus().gameStatus.winner
        }`,
      );
    } else if (gameController.checkGameStatus().gameStatus.winner === null) {
      // Declare the result as a tie
      console.log('The game is a tie!');
    } else {
      // Game will continue; update turn with next player
      whoseTurn = whoseTurn === playerOne ? playerTwo : playerOne;
    }
  };

  // Check gameboard to see if a player has won the game

  const showWhoseTurn = () => whoseTurn;

  return {
    showWhoseTurn,
    checkGameStatus,
    takeTurn,
  };
})();
