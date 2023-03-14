// You’re going to store the gameboard as an array inside of a Gameboard object, so start there! 
    // Your players are also going to be stored in objects, and you’re probably going to want an object to control the flow of the game itself.

// Your main goal here is to have as little global code as possible. 
    // Try tucking everything away inside of a module or factory. 
        // Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. 
        // If you need multiples of something (players!), create them with factories.

const game = (() => {
    //Create the 3x3 game board structure
    /* const topRow = [null, null, null];
    const midRow = [null, null, null];
    const bottomRow = [null, null, null]; */
    const topRow = ["O", "O", "X"];
    const midRow = [null, null, "O"];
    const bottomRow = ["O", "O", "X"];
    let gameBoard = [topRow, midRow, bottomRow];
    
    //Place a player's marker on the cell of their choice
    const updateGameBoard = (playerMarker, cellString) => {
        const cellToMark = cellString.split('-');
   
        switch (cellToMark[0]) {
            case 'topRow':
                topRow[cellToMark[1]] = playerMarker;
                break;
            case 'midRow':
                midRow[cellToMark[1]] = playerMarker;
                break;
            case 'bottomRow':
                bottomRow[cellToMark[1]] = playerMarker;
                break;
        }

        //Check gameboard to see if a player has won the game
    }    
    
    //Show the current game board
    const showGameBoard = () => {
        console.log(gameBoard);
    }

    //Check if the next turn can be taken, i.e. empty cells are available
    const checkForAvailableTurns = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                if (!gameBoard[i][j]) { return true;}
            }
        }
        return false;
    }

    //Module returns the following functions
    return {
        showGameBoard
        , checkForAvailableTurns
        , updateGameBoard
    }
})()

//Create a player object, using a factory function
const playerFactory = (name, marker) => {
    return {
        name
        , marker
    };
}
//Create 2 players, each with their unique marker
const playerOne = playerFactory('Joe','O');
const playerTwo = playerFactory('Felix','X');
const players = [playerOne, playerTwo];

//Create a game controller object as a module
const gameController = (() => {
    let whoseTurn;

    const takeTurn = (player) => {
        //Update turn with current player
        whoseTurn = player;
        //Store the player's selected cell in a variable
        let selectedCell = prompt(`Hi, ${player.name}, please select a cell.`);
        //Update the game board
        game.updateGameBoard(player.marker, selectedCell);
        //Check if the next turn can be taken, i.e. an empty cell is available
        if (!game.checkForAvailableTurns()) {
            //Game over
            console.log("board full")
            return;
        } else {
            //Update the turn with the next player
            whoseTurn = (whoseTurn === playerOne) ? playerTwo : playerOne;
        }
    }

    const showWhoseTurn = () => {
        return whoseTurn;
    }

    return {
        showWhoseTurn
        , takeTurn
    }
})()


    //Keep track of which player's turn it is
    //After each turn, update the gameboard
    //After each turn, check if the game has ended, i.e. won or tied (no more cells available)
    //After each turn, update which player's turn it is