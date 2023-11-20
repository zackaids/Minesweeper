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
    board.forEach(row => {
        row.forEach(cell => {
            const element = document.createElement("div");
            boardElement.append(element)
            // -- method to left click on tiles
            // tile.element.addEventListener('click', () => {
            //     // imported revealTile function for revealing tiles
            //     revealTile(board, tile)
            //     checkGameEnd()
            // })
            // // -- method to right click on tiles
            // tile.element.addEventListener('contextmenu', e => {
            //     e.preventDefault()
            //     // imported markTile function for marking tiles
            //     markTile(tile)
            //     listMinesLeft()
            // })
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


