'use strict'

const LIFE = '❤️'
const LOSE = '🤯'
const WIN = '😎'
const NORMAL = '😀'
const HINT = '💡'

function onBeginner() {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gGame.isOn = false
    gGame.isFirstClick = true
    gGame.lives = 2
    gGame.level = 'beginner'
    gScore = 'bestBeginnerScore'
    onInit()
}
function onMedium() {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    gGame.isOn = false
    gGame.isFirstClick = true
    gGame.lives = 3
    gGame.level = 'medium'
    gScore = 'bestMediumScore'
    onInit()
}
function onExpert() {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    gGame.isOn = false
    gGame.isFirstClick = true
    gGame.lives = 3
    gGame.level = 'expert'
    gScore = 'bestExpertScore'
    onInit()
}


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
    if (gGame.level === 'beginner') { gGame.lives = 2 }
    if (gGame.level === 'medium') { gGame.lives = 3 }
    if (gGame.level === 'expert') { gGame.lives = 3 }
    resetTimer()
    onInit()
}

function renderRestartBtn() {
    const elRestartBtn = document.querySelector('.restart-btn')
    elRestartBtn.innerText = NORMAL
    return elRestartBtn
}

function startTimer() {
    var startTime = Date.now()
    const elTimer = document.querySelector('.timer')
    gTimer = setInterval(() => {
        const diff = Date.now() - startTime
        elTimer.innerText = (diff / 1000).toFixed(3)
        gGame.secsPassed = (diff / 1000).toFixed(3)
    }, 10)
}

function resetTimer() {
    clearInterval(gTimer)
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = '0.000'
}

function onHintMode(cellI, cellJ, board) {
    var timer
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var cell = board[i][j]
            if (j < 0 || j >= board[i].length) continue
            if (!cell.isShown && !cell.isMarked && gLevel.MINES) {
                const elCell = getCell(i, j)
                elCell.classList.remove('transparent')

                const timer = setTimeout(() => {
                    gGame.isHint = false
                    elCell.style.backgroundColor = '#645CBB'
                    elCell.classList.add('transparent')

                }, 1000)
            }
        }
    }
    clearTimeout(timer)
}

function activateHintMode(i) {
    gGame.isHint = true
    const elhinI = document.querySelector(`.hint-${i}`)
    elhinI.disabled = true
}

function renderHints() {
    var strHTML = ''
    for (var i = 0; i < gGame.hints; i++) {
        strHTML += `<button class="hint-${i}" onclick="activateHintMode(${i})">💡</button>`
    }
    const elhinstBtn = document.querySelector('.hints-btns')
    elhinstBtn.innerHTML = strHTML
}

function saveBestScore() {

    if (+localStorage.getItem(gScore) === 0) {
        localStorage.setItem(gScore, gGame.secsPassed)
    } else if (+localStorage.getItem(gScore) > +gGame.secsPassed || localStorage.getItem(gScore) === null) {
        localStorage.setItem(gScore, gGame.secsPassed)
    }
    const elBestScore = document.querySelector(".best-score")
    elBestScore.innerHTML = `Best Score:` + localStorage.getItem(gScore)
}

function ShowBestScore() {

    if (localStorage.getItem(gScore) === null) {
        const elBestScore = document.querySelector('.best-score')
        elBestScore.innerText = `Best Score: To be determined`
    } else {
        const elBestScore = document.querySelector('.best-score')
        elBestScore.innerHTML = `Best Score:` + localStorage.getItem(gScore)
    }
}

function getSafeClickCell() {
    var emptyLocation = drawNum2(gEmptyLocations)
    var i = emptyLocation.i
    var j = emptyLocation.j
    while (gBoard[i][j].isMarked || gBoard[i][j].isShown) {
        emptyLocation = drawNum2(gEmptyLocations)
        i = emptyLocation.i
        j = emptyLocation.j
    } return emptyLocation
}

function onSafeClick() {
    if (gGame.safeCount === 0) return
    if (!gGame.isOn) return
    var safeLocation = getSafeClickCell()
    var i = safeLocation.i
    var j = safeLocation.j
    gGame.safeCount--
    const elSafetxt = document.querySelector('.safe-txt')
    elSafetxt.innerText = gGame.safeCount + ' Clicks available'
    const elCell = getCell(i, j)
    elCell.style.backgroundColor = 'blue'
    const timer = setTimeout(() => {
        const elCell = getCell(i, j)
        elCell.style.backgroundColor = '#645CBB'
    }, 1000)
}




///////////////////////////NOT IN USE////////////////////////////
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