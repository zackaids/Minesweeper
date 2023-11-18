// display

// Importing the createBoard function from minesweeper.js
import {
    TILE_STATUSES,
    createBoard,
    markTile,
    revealTile,
    checkWin,
    checkLose
} from "./minesweeper.js";

// -- populate a board with tiles/mines
// constant variables 
let boardWidth
let boardHeight
let numberOfMines

// 9x9 10 mines
// 16x16 40 mines
// 30x16 99 mines 

// calling the variables 
let board
const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')


// setting up the board
function renderBoard() {
    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element)
            // -- method to left click on tiles
            tile.element.addEventListener('click', () => {
                // imported revealTile function for revealing tiles
                revealTile(board, tile)
                checkGameEnd()
            })
            // -- method to right click on tiles
            tile.element.addEventListener('contextmenu', e => {
                e.preventDefault()
                // imported markTile function for marking tiles
                markTile(tile)
                listMinesLeft()
            })
        })
    })
    boardElement.style.setProperty('--size-width', boardWidth)
    boardElement.style.setProperty('--size-height', boardHeight)
    minesLeftText.textContent = numberOfMines
    boardElement.style.visibility = "visible"
}

function clearBoard() {
    boardElement.innerHTML = ""
    boardElement.style.visibility = "hidden"
}
function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)

    minesLeftText.textContent = numberOfMines - markedTilesCount
}


// -- method to check for the end of the game 
function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        boardElement.addEventListener('click', stopProp, { capture: true })
        boardElement.addEventListener('contextmenu', stopProp, { capture: true })
    }

    if (win) {
        messageText.textContent = 'YOU WIN'
    }
    if (lose) {
        messageText.textContent = 'YOU LOSE'
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.TILE_STATUSES === TILE_STATUSES.MARKED) markTile(tile)
                if (tile.mine) revealTile(board, tile)
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}


document.getElementById("beginner").addEventListener("click", () => {
    boardWidth = 9
    boardHeight = 9
    numberOfMines = 10
    board = createBoard(boardWidth, boardHeight, numberOfMines)
    clearBoard()
    renderBoard()
})

document.getElementById("intermediate").addEventListener("click", () => {
    boardWidth = 16
    boardHeight = 16
    numberOfMines = 40
    board = createBoard(boardWidth, boardHeight, numberOfMines)
    clearBoard()
    renderBoard()
})

document.getElementById("expert").addEventListener("click", () => {
    boardWidth = 30
    boardHeight = 16
    numberOfMines = 99
    board = createBoard(boardWidth, boardHeight, numberOfMines)
    clearBoard()
    renderBoard()
})