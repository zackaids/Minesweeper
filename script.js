// 9x9 10 mines
// 16x16 40 mines
// 30x16 99 mines 

const gameSettings = {
    'beginner': {
        'gridWidth': 9,
        'gridHeight': 9,
        'maxMines': 10,
    },
    'intermediate': {
        'gridWidth': 16,
        'gridHeight': 16,
        'maxMines': 40,
    },
    'advanced': {
        'gridWidth': 30,
        'gridHeight': 16,
        'maxMines': 99,
    }
}

export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}

const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector('[data-mine-count]')

let numberOfMines



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

    return { board, gameSettings };
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



function renderBoard(board, gameSettings) {
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            const element = document.createElement("div");
            element.dataset.status = TILE_STATUSES.HIDDEN

            element.addEventListener("click", () => {
                revealCell(x, y, board);
            });
            element.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                markCell(x, y, board);
            })

            boardElement.append(element)
        })
    })
    boardElement.style.setProperty('--size-width', gameSettings.gridWidth)
    boardElement.style.setProperty('--size-height', gameSettings.gridHeight)

    minesLeftText.textContent = numberOfMines
    boardElement.style.visibility = "visible"
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

function markCell(x, y, board) {
    const cell = board[y][x];
    if (cell.isRevealed) {
        return;
    }
    if (cell.isFlagged) {
        cell.isFlagged = false;
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
    if (!cell.isRevealed) {
        cell.isRevealed = true;
    } else {
        cell.isRevealed = false;
    }
    renderBoard(board, currentGameSettings)
}
// function leftClick(x, y, board) {
//     const cell = board[y][x];
//     const element = boardElement.children[y * board[0].length + x];
//     if (!cell.isRevealed) {
//         cell.isRevealed = true;
//     }
//     if (cell.isRevealed || cell.isFlagged) {
//         return;
//     }
//     if (cell.isMine) {
//         element.dataset.status = TILE_STATUSES.MINE;
//         gameOver();
//     } else {
//         element.dataset.status = TILE_STATUSES.NUMBER;
//         if (cell.adjacentMines > 0) {
//             element.textContent = cell.adjacentMines;
//         } else {
//             revealAdjacentCells(x, y, board);
//         }

//     }

// }

// function rightClick(x, y, board) {
//     const cell = board[y][x];
//     if (!cell.isFlagged) {
//         cell.isFlagged = true;
//         element.dataset.status = TILE_STATUSES.MARKED;
//     }
//     if (cell.isRevealed) {
//         return;
//     }
// }





let { board: newBoard, gameSettings: currentGameSettings } = createBoard(gameSettings.beginner);
renderBoard(newBoard, currentGameSettings);

// function placeMine2(board) {
//     const height = board.length;
//     const width = board[0].length;

//     let randomY;
//     let randomX;

//     let condition = true
//     while(condition) {
//         randomY = Math.floor(Math.random() * height);
//         randomX = Math.floor(Math.random() * width);

//         if (board[randomY][randomX] != 1) {
//             board[randomY][randomX] = 1;
//             condition = false
//         }
//     }
// }



// function to erase board

// isFlagged() function to right click on tile

// function to left click on tile
// isRevealed() reveal cell (when cell is revealed, check for mine)

// function to check game win/game lose

// function to reset game

// better UI




