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
    secsPassed: 0,
    isVictory: false,
    isFirstClick: true,
    isHint: false,
    lives: 2,
    hints: 3,
    level: 'beginner',
    safeCount: 3

}

var gBoard
var gEmptyLocations
var gTimer
var gScore = 'bestBeginnerScore'


function onInit() {
    gBoard = buildBoard()
    // console.log(gBoard)
    getEmptyLocations(gBoard)
    // addRandomMines()
    renderBoard(gBoard)
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    ShowBestScore()
    gGame.secsPassed = 0
    gGame.isVictory = false
    
    gGame.safeCount = 3 
    const elSafeTxt = document.querySelector('.safe-txt')
    elSafeTxt.innerText = '3 Clicks available'
    renderLives()
    renderHints()
    renderRestartBtn()
    // const elRestartBtn = document.querySelector('.restart-btn')
    // elRestartBtn.innerText = NORMAL
    // closeModal()
    resetTimer()
}


function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell()
        }
    }
    // board[1][1].isMine = true
    // board[0][3].isMine = true
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
            var innerText = (cell.isMine) ? MINE : cell.minesAroundCount
            // if (cell.isFlages) className += ' Flag'

            strHTML += `\t<td class="${className}" 
                            onclick="cellClicked(this,${i}, ${j})"
                            oncontextmenu="onCellMarked(event,this, ${i},${j})">${innerText}
            
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    const elBoardCell = document.querySelector(`.board-cells`)
    elBoardCell.innerHTML = strHTML

    // elCell.addEventListener("contextmenu", (event) => { event.preventDefault()})
}


function countNeighbors(cellI, cellJ, board) {
    var minesAroundCount = 0

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) minesAroundCount++
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

function cellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (!gGame.isOn) return
    if (cell.isShown || cell.isMarked) return
    if (gGame.isFirstClick) {
        // setTimer()
        startTimer()
        removeFirstCellClicked(i, j)
        gGame.isFirstClick = false
        addRandomMines()
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        var elCurrCell = getCell(i, j)
        elCurrCell.classList.remove('transparent')
        // console.log(elCell, 'hi');
    }
    if (gGame.isHint) {
        onHintMode(i, j, gBoard)
        return
    }
    // console.log(cell.isShown);
    if (cell.isMine) {

        elCell.classList.remove('transparent')
        // elCell.innerText = MINE
        elCell.style.backgroundColor = '#FF2222'
        gameOver()
    }
    
    if (!cell.isShown) {
        cell.isShown = true
        gGame.shownCount++
        // alert('hi')
        // console.log(elcell);
        elCell.classList.remove('transparent')
        checkVictory()
        if (cell.minesAroundCount === 0) {
            expandShown(gBoard, i, j)
        }
    }
}

function addRandomMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var emptyLocation = drawNum2(gEmptyLocations)
        if (!emptyLocation) return
        gBoard[emptyLocation.i][emptyLocation.j].isMine = true
        // console.log('mine');
    }
}

function onCellMarked(event, elCell, i, j) {
    event.preventDefault()
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    if (gBoard[i][j].isMarked) {
        elCell.classList.remove('transparent')
        elCell.innerText = FLAG
        if (gBoard[i][j].isMine) {
            gGame.markedCount++
        }
    } else {
        elCell.classList.add('transparent')
        if(gBoard[i][j].isMine){
            elCell.innerText = MINE
            gGame.markedCount--
        } else elCell.innerText = gBoard[i][j].minesAroundCount
        
    }
    checkVictory()
}
function checkVictory(i, j) {
    // console.log('gGame.SownCount:', gGame.shownCount)
    ///// if the count of the shown === the size of all board - the mines it means all cells are cheked
    // if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {
        ///// you marked all that is open
        // console.log('shown: ' + gGame.shownCount)
        // console.log('marked: ' + gGame.markedCount)
        if (gGame.shownCount + gGame.markedCount === gLevel.SIZE * gLevel.SIZE) {
            gGame.isVictory = true
            gameOver()
            saveBestScore()
        }
    }
// }

function gameOver() {
    if (gGame.isVictory) {
        const elRestartBtn = document.querySelector('.restart-btn')
        elRestartBtn.innerText = WIN
        clearInterval(gTimer)
        // var msg = 'You Won!!!'
        gGame.isOn = false
        gGame.isFirstClick = true
        // console.log('You win')
        // openModal(msg)
        return
    }
    if (gGame.lives > 1) {
        gGame.lives--
        renderLives()
        return
    } else {
        gGame.lives--
        // var msg = 'Game Over!!!'
        revealAllMines()
        gGame.isOn = false
        gGame.isFirstClick = true
        // console.log('GAME OVER')
        // openModal(msg)
        renderLives()
        const elRestartBtn = document.querySelector('.restart-btn')
        elRestartBtn.innerText = LOSE

        clearInterval(gTimer)
    }
}
function revealAllMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) {
                const elCell = getCell(i, j)
                elCell.classList.remove('transparent')
            }
        }
    }
}


function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isShown) continue
            if (board[i][j].isMarked) return
            if (board[i][j].isMine) return

            // if (board[i][j].minesAroundCount === 0) {
            const elNeighborCell = getCell(i, j)
            // board[i][j].isShown = true
            // elNeighborCell.classList.remove('transparent')
            // elNeighborCell.innerText = board[i][j].minesAroundCount
            cellClicked(elNeighborCell, i, j) // recursion??
        }
    }
}

// }
function removeFirstCellClicked(i, j) {
    // console.log('i:', i)
    // console.log('j:', j)
    for (var k = 0; k < gEmptyLocations.length; k++) {
        var currLocation = gEmptyLocations[k]
        if (currLocation.i === i && currLocation.j === j) {
            // console.log('currLocation:', currLocation)
            gEmptyLocations.splice(k, 1)
            // console.log(gEmptyLocations);
            // console.log('k:', k)
            return
        }
    }
}


