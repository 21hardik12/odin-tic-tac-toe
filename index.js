const Cell = (idValue) => {
    let value = 0;
    let id = idValue;
    const getValue = () => value;
    const setValue = (newValue) => value = newValue;
    const getId = () => id;

    return {getValue, setValue, getId};
}

const gameBoard = (() => {
    const board = [];
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i][j] = Cell(i * 3 + j);
        }
    }

    const printBoard = () => {
        console.table(board.map(row => row.map(cell => cell.getValue)));        
    }

    const markCell = (cellId, player) => {
        if ()
    }

    return {printBoard};
})();

const GameController = (() => {    
    const playerOne = 1;
    const playerTwo = 2;

    gameBoard.printBoard();
})();