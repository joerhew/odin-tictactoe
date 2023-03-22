// Create a player object, using a factory function
const playerFactory = (name, marker) => ({
  name,
  marker,
});
// Create 2 players, each with their unique marker
const players = [];
let whoseTurn;
let playerOne;
let playerTwo;

// Game board
const gameMessages = (() => {
  const gameMessage = document.querySelector('#prompt');

  const MESSAGE_INITIAL = 'Up for a game?';
  const MESSAGE_WIN = ' wins the game!';
  const MESSAGE_TIE = `It's a tie!`;
  const MESSAGE_ERR_CELL_TAKEN = 'That cell is already taken. Try another one.';
  const MESSAGE_WHOSE_TURN_FIRST = `It's `
  const MESSAGE_WHOSE_TURN_SECOND = `'s turn!`

  const displayMessage = (msg) => {
    gameMessage.innerText = msg;
  }

  displayMessage(MESSAGE_INITIAL);

  return {
    displayMessage,
    MESSAGE_INITIAL,
    MESSAGE_WIN,
    MESSAGE_TIE,
    MESSAGE_ERR_CELL_TAKEN,
    MESSAGE_WHOSE_TURN_FIRST,
    MESSAGE_WHOSE_TURN_SECOND
  }
})();

const gameBoard = (() => { 
  const CONTAINER = document.querySelector('.container');
  const BTN_START = document.querySelector('.btn-start');
  const PLAYER_FORM = document.querySelector('form');
  const PLAYER_ONE_NAME = document.querySelector('#player-1-name');
  const PLAYER_ONE_MARKER = document.querySelector('#player-1-marker');
  const PLAYER_TWO_NAME = document.querySelector('#player-2-name');
  const PLAYER_TWO_MARKER = document.querySelector('#player-2-marker');

  PLAYER_FORM.addEventListener('submit', (e) => {
    PLAYER_FORM.classList.add('hidden');
    playerOne = playerFactory(PLAYER_ONE_NAME.value, PLAYER_ONE_MARKER.value);
    playerTwo = playerFactory(PLAYER_TWO_NAME.value, PLAYER_TWO_MARKER.value);
    players.push(playerOne);
    players.push(playerTwo);
    whoseTurn = playerOne;
    console.log("wtf");
    gameMessages.displayMessage(gameMessages.MESSAGE_WHOSE_TURN_FIRST + whoseTurn.name + gameMessages.MESSAGE_WHOSE_TURN_SECOND);
    create();
    e.preventDefault();
    e.stopPropagation();
  }) 
  console.log("hi");
  
  const board = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ];

  const BTN_RESET = document.createElement('button');
  const BTN_RESTART = document.createElement('button');
  const CONTAINER_BTN = document.querySelector('.btn-container');

  BTN_RESET.innerText = 'Select new players';
  BTN_RESTART.innerText = 'Restart game';

  CONTAINER_BTN.appendChild(BTN_RESET);
  CONTAINER_BTN.appendChild(BTN_RESTART);

  BTN_RESET.classList.add('hidden','btn-reset');
  BTN_RESTART.classList.add('hidden','btn-restart');

  const create = () => {
    // Add event listener to clicks on game board
    const GRID = document.createElement('div');
    GRID.classList.toggle('ttt-grid');
    CONTAINER.insertBefore(GRID,CONTAINER_BTN);
    
    GRID.addEventListener('click', e => {
      const regex =  /(?<row>\d)-(?<col>\d)/
      const htmlID = e.target.id;
      const clickedRowAndCol = htmlID.match(regex);
      const clickedRow = clickedRowAndCol.groups.row;
      const clickedCol = clickedRowAndCol.groups.col;

      gameController.takeTurn(gameController.showWhoseTurn(),clickedRow,clickedCol);
    })
  
    for (let row = 0; row < board.length; row += 1) {
      for (let col = 0; col < board[row].length; col += 1) {
        const cell = document.createElement('div');
        cell.classList.add('ttt-cell');
        cell.id = `ttt-cell-${row}-${col}`;
        GRID.appendChild(cell);
      }
    }

    BTN_RESET.classList.toggle('hidden');
    BTN_RESET.addEventListener('click', () => reset())

    BTN_RESTART.classList.toggle('hidden');
    BTN_RESTART.addEventListener('click', () => clear())
  }

  const reset = () => {
    clear();
    gameMessages.displayMessage(gameMessages.MESSAGE_INITIAL);
    BTN_RESET.classList.add('hidden');
    BTN_RESTART.classList.add('hidden');
    PLAYER_FORM.classList.remove('hidden');
    
    document.querySelector('.ttt-grid').remove();
  }

  // Place a player's marker on the cell of their choice
  const update = (playerMarker, row, column) => {
    const cellToUpdate = document.querySelector(`#ttt-cell-${row}-${column}`);
    // Update board
    board[row][column] = playerMarker;
    // Update HTML board
    cellToUpdate.innerText = playerMarker;
  };

  // Show the current game board
  const show = () => board;

  const clear = () => {
    gameMessages.displayMessage(gameMessages.MESSAGE_WHOSE_TURN_FIRST + whoseTurn.name + gameMessages.MESSAGE_WHOSE_TURN_SECOND);
    for (let i = 0; i < board.length; i += 1) {
        for (let j = 0; j < board[i].length; j += 1) {
            board[i][j] = undefined;
            document.querySelector(`#ttt-cell-${i}-${j}`).innerText = "";
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

// Create a game controller object as a module
const gameController = (() => {

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
      if (checkForWinningCombination(possibleWinCombinations[i])) {
        gameStatus.winner = players.find(player => player.marker === possibleWinCombinations[i][0]);
      }
    }
    
    checkForTie();

    return {
      gameStatus,
    };
  };

  const takeTurn = (player,row,col) => {
    // Update turn with current player
    const selectedRow = row;
    const selectedColumn = col;

    // Check if the selected cell is available for play
    if (gameBoard.show()[selectedRow][selectedColumn]) {
        gameMessages.displayMessage(gameMessages.MESSAGE_ERR_CELL_TAKEN);
        return;
    }
    // Update the game board
    gameBoard.update(player.marker, selectedRow, selectedColumn);
    
    // Check if game is over
    const {winner} = gameController.checkStatus().gameStatus;

    if (winner) {
      // Declare the winner
      gameMessages.displayMessage(gameController.checkStatus().gameStatus.winner.name + gameMessages.MESSAGE_WIN);
    } else if (winner === null) {
      // Declare the result as a tie
      gameMessages.displayMessage(gameMessages.MESSAGE_TIE);
    } else {
      // Game will continue; update turn with next player
      whoseTurn = whoseTurn === playerOne ? playerTwo : playerOne;
      gameMessages.displayMessage(gameMessages.MESSAGE_WHOSE_TURN_FIRST + whoseTurn.name + gameMessages.MESSAGE_WHOSE_TURN_SECOND);
    }
  };

  const showWhoseTurn = () => whoseTurn;

  return {
    showWhoseTurn,
    checkStatus,
    takeTurn,
  };
})();
