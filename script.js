// 9x9 10 mines
// 16x16 40 mines
// 30x16 99 mines 

const gameSettings = {
    'beginner': {
        'gridWidth': 9,
        'gridHeight': 9,
        'maxMines': 10,
        'totalRevealed': 71,
    },
    'intermediate': {
        'gridWidth': 16,
        'gridHeight': 16,
        'maxMines': 40,
        'totalRevealed': 216,
    },
    'expert': {
        'gridWidth': 30,
        'gridHeight': 16,
        'maxMines': 99,
        'totalRevealed': 381,
    }
}
const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    FLAGGED: "flagged",
}

const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector(".mines-left")
let minesLeft = document.querySelector('[data-mine-count]')

function createBoard(gameSettings) {
    let board = [];
    for (let y = 0; y < gameSettings.gridHeight; y++) {
        const row = [];
        for (let x = 0; x < gameSettings.gridWidth; x++) {
            let cell = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
            }
            row.push(cell);
        }
        board.push(row);
    }

    for (let i = 0; i < gameSettings.maxMines; i++) {
        placeMine(board);
    }

    calculateAdjacentMines(board);
    let gameOver = false;

    minesLeft.textContent = gameSettings.maxMines

    return {
        board,
        gameSettings,
        gameOver
    };
}


function placeMine(board) {
    const height = board.length;
    const width = board[0].length;
    const randomY = Math.floor(Math.random() * height);
    const randomX = Math.floor(Math.random() * width);

    if (!board[randomY][randomX].isMine) {
        board[randomY][randomX].isMine = true;
    } else {
        placeMine(board);
    }
}

function clearBoard() {
    while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.firstChild);
    }
}

function renderBoard(board, gameSettings) {
    clearBoard();
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            const element = document.createElement("div");
            element.dataset.status = getStatusFromCell(cell);


            if (cell.adjacentMines > 0 && cell.isRevealed) {
                element.textContent = cell.adjacentMines;
            }

            element.addEventListener("click", () => {
                if (gameOver) {
                    return;
                }
                revealCell(x, y, board);

            });
            element.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (gameOver) {
                    return;
                }
                flagCell(x, y, board);
                listMinesLeft(board, gameSettings);
            })

            boardElement.append(element)
        })
    })
    boardElement.style.setProperty('--size-width', gameSettings.gridWidth)
    boardElement.style.setProperty('--size-height', gameSettings.gridHeight)


    boardElement.style.visibility = "visible"
}

function getStatusFromCell(cell) {
    if (cell.isRevealed) {
        if (cell.isMine) {
            return TILE_STATUSES.MINE;
        } else if (cell.adjacentMines >= 0) {
            return TILE_STATUSES.NUMBER;
        } else {
            return TILE_STATUSES.HIDDEN;
        }
    } else if (cell.isFlagged) {
        return TILE_STATUSES.FLAGGED;
    } else {
        return TILE_STATUSES.HIDDEN;
    }
}

function calculateAdjacentMines(board) {
    const height = board.length;
    const width = board[0].length;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let adjacentMines = 0;

            // the previous for loop iterates through each cell
            // these next for loops iterate through each cell within the one square radius
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const newY = y + dy;
                    const newX = x + dx;

                    // this if statement is needed to make sure that the new x and y
                    // are not out of bounds 
                    // (if new x/y=0 or greater than/equal to width/height)
                    if (newY >= 0 && newY < height && newX >= 0 && newX < width) {
                        if (board[newY][newX].isMine) {
                            adjacentMines++;
                        }
                    }
                }
            }

            board[y][x].adjacentMines = adjacentMines;
        }
    }
}

function flagCell(x, y, board) {
    const cell = board[y][x];
    if (cell.isRevealed && cell.isFlagged) {
        return;
    }
    if (cell.isFlagged) {
        cell.isFlagged = false;
        cell.isHidden = true;
    } else {
        cell.isFlagged = true;
    }
    renderBoard(board, currentGameSettings);
}

function revealCell(x, y, board) {
    const cell = board[y][x];
    if (cell.isRevealed || cell.isFlagged) {
        return;
    }
    if (cell.isMine) {
        gameLose(board);
        // return;
    }
    cell.isRevealed = true;
    if (cell.adjacentMines === 0) {
        floodFill(x, y, board)
    }
    if (!cell.isMine) {
        checkWin(board);
    }
    renderBoard(board, currentGameSettings)
}

function floodFill(x, y, board) {
    const height = board.length;
    const width = board[0].length;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const newY = y + dy;
            const newX = x + dx;

            if (newY >= 0 && newY < height && newX >= 0 && newX < width) {
                const neighbor = board[newY][newX];
                if (!neighbor.isMine && !neighbor.isRevealed) {
                    neighbor.isRevealed = true;
                    if (neighbor.adjacentMines === 0) {
                        floodFill(newX, newY, board);
                    }
                }
            }
        }
    }
}

// flat array for fun xD 
function gameLose(board) {
    const flatBoard = board.flat();
    for (let i = 0; i < flatBoard.length; i++) {
        if (flatBoard[i].isMine && !flatBoard[i].isFlagged) {
            flatBoard[i].isRevealed = true;
        }
    }
    gameOver = true;
    minesLeftText.innerHTML = "YOU LOSE";
}

function checkWin(board) {
    const height = board.length;
    const width = board[0].length;
    let revealed = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (board[y][x].isRevealed) {
                revealed++;
            }
        }
    }
    if (revealed === currentGameSettings.totalRevealed) {
        minesLeftText.innerHTML = "YOU WIN";
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (board[y][x].isMine) {
                    board[y][x].isFlagged = true;
                }
            }
        }
        gameOver = true;
    }
}

function listMinesLeft(board, gameSettings) {
    const height = board.length;
    const width = board[0].length;
    let mineCount = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (board[y][x].isFlagged && mineCount < gameSettings.maxMines) {
                mineCount++
            }
        }
    }
    minesLeft.textContent = gameSettings.maxMines - mineCount
}



let data = createBoard(gameSettings.beginner);

// global game state variables
let newBoard = data.board;
let currentGameSettings = data.gameSettings
let gameOver = data.gameOver

renderBoard(newBoard, currentGameSettings);

const resetButton = document.querySelector(".reset-game");
resetButton.addEventListener("click", resetGame);
function resetGame() {
    clearBoard();
    minesLeftText.innerHTML = `Mines Left: <span data-mine-count></span>`;
    minesLeft = document.querySelector('[data-mine-count]');
    let data = createBoard(gameSettings.beginner);
    newBoard = data.board;
    currentGameSettings = data.gameSettings;
    gameOver = data.gameOver
    console.log(minesLeft);
    renderBoard(newBoard, currentGameSettings);

}

// function middle click/leftclick || chording

// timer function

// better UI




