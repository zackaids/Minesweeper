// display

// Importing the createBoard function from minesweeper.js
import { createBoard } from "./minesweeper.js";


// populate a board with tiles/mines
const board = createBoard(2, 2)
const boardElement = document.querySelector('.board')
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
    })
})


// -method to left click on tiles
// -reveal tile
// -method to right click on tiles
// -mark tiles
// method to check for the end of the game 