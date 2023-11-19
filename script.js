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



// function to create board
function createBoard(gameSettings) {
    let board = [];
    for (let y = 0; y < gameSettings.gridHeight; y++) {
        const row = [];
        for (let x = 0; x < gameSettings.gridWidth; x++) {
            let cell = 0;
            row.push(cell);
        }
        board.push(row);
    }

    for (let i = 0; i < gameSettings.maxMines; i++) {
        placeMine(board);
    }

    return board;
}




// function to place a mine at a random place in a 2d array
function placeMine(board) {
    const height = board.length;
    const width = board[0].length;
    const randomY = Math.floor(Math.random() * height);
    const randomX = Math.floor(Math.random() * width);

    if (board[randomY][randomX] !== 1) {
        board[randomY][randomX] = 1;
    } else {
        placeMine(board);
    }
}


/*

[
    [0,0,0 ...],
    [0,0,0 ...],
    [0,0,0 ...],
    [0,0,0 ...],
    [0,0,0 ...],
    [0,0,0 ...]
]

*/

// rendering board
function renderBoard(board) {
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

let newboard = createBoard(gameSettings.beginner);
renderBoard(newboard);

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

/*
setneterce. trying

*/

// function to erase board

// function to right click on tile

// function to left click on tile

// function to check game win/game lose


