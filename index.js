const Cell = (idValue, r, c) => {
    let value = 0;
    let id = idValue;
    let row = r;    
    let column = c;
    const getValue = () => value;
    const setValue = (newValue) => value = newValue;
    const getId = () => id;

    return {row, column, getValue, setValue, getId};
}

const gameBoard = (() => {
    const board = [];
    
    const init = () => {
        board.splice(0, board.length);
        for (let i = 0; i < 3; i++) {        
            for (let j = 0; j < 3; j++) {
                board.push(Cell(i*3 + j, i , j));
            }
        }
    }
    

    const printBoard = () => {
        console.table(board.map(cell => cell.getValue()));        
    }

    const getCell = (cellId) => board[cellId];

    const markCell = (cellId, player) => {
        const cell = getCell(cellId);        
        if (cell.getValue() === 0) {
            cell.setValue(player)
            return true;
        };        

        return false;
    }

    const getBoard = () => board;

    const checkWinFor = (token) => {
        const tokenCells = board.filter(cell => cell.getValue() === token);
        if (tokenCells.length >=3) {            
            const sameRowColumnCells = tokenCells.reduce((groups, cell) => {
                const {row, column} = cell;                
                               

                groups[0][row]++;
                groups[1][column]++;
                if (row === column) groups[2]++;
                if (row + column === 2) groups[3]++;
                return groups;
            }, [[0, 0, 0], [0, 0, 0], 0, 0]);
            return (sameRowColumnCells[0].some(row => row === 3)) ||
             (sameRowColumnCells[1].some(column => column === 3)) ||
             (sameRowColumnCells[2] === 3 || sameRowColumnCells[3] === 3);            
        }
    }

    const clear = () => {
        init();
    }

    init();

    return {getBoard ,printBoard, markCell, getCell, checkWinFor, clear};
})();

const Game = ((playerOneName = "Player X", playerTwoName = "Player O") => {    
    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ]

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;
    
    const reset = () => {
        gameBoard.clear();
        activePlayer = players[0];
    }
    
    const playRound = (cellId) => {        
        const player = getActivePlayer();        
        if (gameBoard.markCell(cellId, player.token)) {
            switchPlayerTurn();        
        }
    }

    const checkWin = () => {
        if (gameBoard.checkWinFor(players[0].token)) {
            return players[0];
        }
        if (gameBoard.checkWinFor(players[1].token)) {
            return players[1];
        }
    }
    
    return {reset, playRound, getActivePlayer, checkWin};
})();

const ScreenController = (() => {
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const restartBtn = document.querySelector('.restartBtn');
    
    //initialisation    
    
    restartBtn.addEventListener('click', (e) => {
        Game.reset();
        boardDiv.innerHTML = '';
        init();
    })
    const printPlayer = () => {
        playerTurnDiv.textContent = `${Game.getActivePlayer().name}'s turn..`;
    }
    const updateBoard = (cellId) => {
        const winner = Game.checkWin();
        printPlayer();
        const cells = document.querySelectorAll('.cell');
        for (const cell of cells) {
            if (cell.dataset.id === cellId) {
                cell.textContent = gameBoard.getCell(cellId).getValue();
                break;
            }
        }
        if (winner) {            
            playerTurnDiv.textContent = `${winner.name} WON`;
            endGame();
            return;
        }
    }
    
    function init() {
        gameBoard.getBoard().forEach(cell => {
            const cellBtn = document.createElement('button');
            cellBtn.classList.add('cell');

            cellBtn.dataset.id = cell.getId();
            boardDiv.appendChild(cellBtn);
        });
        boardDiv.addEventListener('click', clickHandler);
        printPlayer();
    }

    function endGame() {
        boardDiv.removeEventListener('click', clickHandler);        
        Game.reset();
    }
    
    function clickHandler(e) {
        const selectedCell = e.target.dataset.id;
        if (!selectedCell) return;
        
        Game.playRound(selectedCell);
        updateBoard(selectedCell);
    }
    
    init();
})();