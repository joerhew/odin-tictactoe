const gameBoard = (() => {
  // Create the 3x3 game board structure
  const board = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ];

  // Place a player's marker on the cell of their choice
  const update = (playerMarker, row, column) => {
    board[row][column] = playerMarker;
  };

  // Show the current game board
  const show = () => board;

  const clear = () => {
    for (let i = 0; i < board.length; i += 1) {
        for (let j = 0; j < board[i].length; j += 1) {
            board[i][j] = undefined;
        }
    }
  }

  // Module returns the following functions
  return {
    show,
    update,
    clear
  };
})();

// Create a player object, using a factory function
const playerFactory = (name, marker) => ({
  name,
  marker,
});
// Create 2 players, each with their unique marker
const players = [];

const playerOne = playerFactory('Joe', 'O');
const playerTwo = playerFactory('Felix', 'X');

players.push(playerOne);
players.push(playerTwo);

// Create a game controller object as a module
const gameController = (() => {
  let whoseTurn;

  const checkStatus = () => {
    const currentBoard = gameBoard.show();
    const possibleWinCombinations = [];
    const gameStatus = {
      winner: undefined,
    };

    // Check if there's a tie
    const checkForTie = () => {
      for (let row = 0; row < currentBoard.length; row += 1) {
        for (let col = 0; col < currentBoard[row].length; col += 1) {
          // Check for an empty cell, i.e. not yet a tie
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
    for (let row = 0; row < currentBoard.length; row += 1) {
      possibleWinCombinations.push(currentBoard[row]);
    }
    // Check for a "column win"
    for (let col = 0; col < currentBoard[0].length; col += 1) {
      const extractColumns = (arr, n) => arr.map((x) => x[n]);
      possibleWinCombinations.push(extractColumns(currentBoard, col));
    }
    // Check for a "diagonal win"
    const topLeftDiag = [];
    const bottomLeftDiag = [];
    for (let row = 0; row < currentBoard.length; row += 1) {
      topLeftDiag.push(currentBoard[row][row]);
      bottomLeftDiag.push(currentBoard[row][currentBoard.length - 1 - row]);
    }
    possibleWinCombinations.push(topLeftDiag, bottomLeftDiag);
    
    // Assign the marker of the winner to the game status if there is one
    const checkForWinningCombination = (arr) => arr.every((marker) => (marker !== undefined && marker === arr[0]));

    for (let i = 0; i < possibleWinCombinations.length; i += 1) {
      console.log(checkForWinningCombination(possibleWinCombinations[i]));
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
    // Check if the selected cell is available for play
    if (gameBoard.show()[selectedRow][selectedColumn]) {
        alert("That cell is already taken. Try another one.");
        return;
    }
    // Update the game board
    gameBoard.update(player.marker, selectedRow, selectedColumn);
    console.log(gameBoard.show());
    // Check if game is over
    const {winner} = gameController.checkStatus().gameStatus;

    if (winner) {
      // Declare the winner
      console.log(
        `The winner plays with the marker ${
          gameController.checkStatus().gameStatus.winner
        }`,
      );
    } else if (winner === null) {
      // Declare the result as a tie
      console.log('The game is a tie!');
    } else {
      // Game will continue; update turn with next player
      whoseTurn = whoseTurn === playerOne ? playerTwo : playerOne;
    }
  };

  const showWhoseTurn = () => whoseTurn;

  return {
    showWhoseTurn,
    checkStatus,
    takeTurn,
  };
})();
