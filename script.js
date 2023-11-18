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
const BOARD_SIZE = 16
const NUMBER_OF_MINES = 40

// 9x9 10 mines
// 16x16 40 mines
// 30x16 99 mines 

// calling the variables 
const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')

// setting up the board
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
boardElement.style.setProperty('--size', BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)

    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
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