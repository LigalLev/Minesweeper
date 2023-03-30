'use strict'

const MINE = '💣'
const FLAG = '🚩'
const LIFE = '❤️'
const LOSE = '🤯'
const WIN = '😎'
const NORMAL = '😀'

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
    lives: 3
}

var gBoard
var gEmptyLocations
var gTimer

function onInit() {
    gBoard = buildBoard()
    console.log(gBoard)
    getEmptyLocations(gBoard)
    // addRandomMines()
    renderBoard(gBoard)
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.isVictory = false
    gGame.lives = 3
    renderLives()
    const elRestartBtn = document.querySelector('.restart-btn')
    elRestartBtn.innerText = NORMAL
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
            // var className = (cell.isMine) ? 'mine' : ''
            // if (cell.isFlages) className += ' Flag'
            strHTML += `\t<td class="${className}" 
                            onclick="cellClicked(this,${i}, ${j})"
                            oncontextmenu="onCellMarked(event,this, ${i},${j})">${cell.minesAroundCount}
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

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    const cell = gBoard[i][j]
    if (gGame.isFirstClick) {
        // setTimer()
        startTimer()
        removeFirstCellClicked(i, j)
        gGame.isFirstClick = false
        addRandomMines()
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
        elCurrCell.classList.remove('transparent')
        // console.log(elCell, 'hi');
    }
    if (cell.isMine) {
        elCell.classList.remove('transparent')
        elCell.innerText = MINE
        elCell.style.backgroundColor = '#FF2222'
        gameOver()
    }
    if (cell.isShown || cell.isMarked) return
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
        console.log('mine');
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

function onCellMarked(event, elCell, i, j) {
    event.preventDefault()
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    if (gBoard[i][j].isMarked) {
        elCell.classList.remove('transparent')
        elCell.innerText = FLAG
        if (gBoard[i][j].isMine) {
            gGame.markedCount++
        }
        // const elCellCounter = document.querySelector('.cell-counter')
        // elCellCounter.innerText = gGame.markedCount
        console.log(gGame.markedCount);
    } else {
        elCell.classList.add('transparent')
        elCell.innerText = gBoard[i][j].minesAroundCount
        if (gBoard[i][j].isMine) {
            gGame.markedCount--
        }
    }
    checkVictory()
}
function checkVictory(i, j) {
    console.log('gGame.SownCount:', gGame.shownCount)
    ///// if the count of the shown === the size of all board - the mines it means all cells are cheked
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {
        ///// you marked all that is open
        console.log('shown: ' + gGame.shownCount)
        console.log('marked: ' + gGame.markedCount)
        if (gGame.shownCount + gGame.markedCount === gLevel.SIZE * gLevel.SIZE) {
            gGame.isVictory = true
            gameOver()
        }
    }
}

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
                const elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.remove('transparent')
                elCell.innerText = MINE
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
            const elNeighborCell = document.querySelector(`.cell-${i}-${j}`)
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

function onBeginner() {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gGame.isOn = false
    gGame.isFirstClick = true
    onInit()
}
function onMedium() {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    gGame.isOn = false
    gGame.isFirstClick = true
    onInit()
}
function onExpert() {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    gGame.isOn = false
    gGame.isFirstClick = true
    onInit()
}
/////can do it with one function but then need to enter objects to html, wasnt sure if it is good practice
// function changeLevel (newLevel){
//     gLevel = newLevel
//     onInit()
// }

function renderLives() {
    var lifeOnBoard = ''
    for (var i = 0; i < gGame.lives; i++) {
        lifeOnBoard += LIFE

    }
    const elLife = document.querySelector('.life')
    elLife.innerText = lifeOnBoard
}

function onRestart() {
    gGame.isOn = false
    gGame.isFirstClick = true
    resetTimer()
    onInit()
}
//// couldnt choose which one to use, this one uses the global object, but the second one is nicer
function setTimer() {
    gTimer = setInterval(() => {
        gGame.secsPassed++
        const elTimer = document.querySelector('.timer')
        elTimer.innerText = gGame.secsPassed
        console.log(elTimer);
    }, 1000)
}

function resetTimer() {
    clearInterval(gTimer)
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = '0.000'
}

function openModal(msg) {
    const elModal = document.querySelector('.modal')
    const elSpan = elModal.querySelector('.msg')
    elSpan.innerText = msg
    elModal.style.display = 'block'
}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}

function startTimer() {
    var startTime = Date.now()
    const elTimer = document.querySelector('.timer')
    gTimer = setInterval(() => {
        const diff = Date.now() - startTime
        elTimer.innerText = (diff / 1000).toFixed(3)
    }, 10)
}

