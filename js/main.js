'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


var gBoard
var gEmptyLocations

function onInit() {
    gBoard = buildBoard()
    console.log(gBoard)
    getEmptyLocations(gBoard)
    addRandomMines()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}


function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            // board[i][j] = (Math.random() > 0.5) ? MINE : ''
            board[i][j] = createCell()
        }
    }
    // board[1][1].isMine = true
    //     board[0][3].isMine = true
    return board
}

function createCell() {
    var cell = {
        isShown: false,
        isMine: false,
        isMarked: false,
        minesAroundCount: 0
    }
    return cell
}

function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += `<tr class="cell-row">\n`
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = gBoard[i][j]
            var className = `cell transparent cell-${i}-${j}`
            // var className = (cell.isMine) ? 'mine' : ''
            // if (cell.isFlages) className += ' Flag'
            strHTML += `\t<td class="${className}" 
                            onclick="CellClicked(this,${i}, ${j})"
                            oncontextmenu="onCalledMark(event,this, ${i},${j})">${cell.minesAroundCount}
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    const elBoardCell = document.querySelector(`.board-cells`)
    elBoardCell.innerHTML = strHTML

    // elCell.addEventListener("contextmenu", (event) => { event.preventDefault()})
}

function countNeighbors(cellI, cellJ, mat) {
    var minesAroundCount = 0

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine) minesAroundCount++
        }
    }
    return minesAroundCount
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board)

        }
    }
}

function CellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (cell.isMine) {
        elCell.classList.remove('transparent')
        elCell.innerText = MINE
        gameOver()
    }
    if (cell.isShown || cell.isMarked) return
    if (!cell.isShown) {
        cell.isShown = true
        gGame.shownCount++
        // alert('hi')
        // console.log(elcell);
        elCell.classList.remove('transparent')
    }
}

function addRandomMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var emptyLocation = drawNum2(gEmptyLocations)
        if (!emptyLocation) return
        gBoard[emptyLocation.i][emptyLocation.j].isMine = true
    }
}
function getEmptyLocations(board) {
    gEmptyLocations = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            gEmptyLocations.push({ i, j })
        }
    }
}

function onCalledMark(event, elCell, i, j) {
    event.preventDefault()
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    if (gBoard[i][j].isMarked) {
        elCell.classList.remove('transparent')
        elCell.innerText = FLAG
        gGame.markedCount++
    } else {
        elCell.classList.add('transparent')
        elCell.innerText = gBoard[i][j].minesAroundCount
        gGame.markedCount--
    }

}

// function gameOver() {
//     if (gBoard[i][j].isMine) {
//         log('GAME OVER')
//     }
// }