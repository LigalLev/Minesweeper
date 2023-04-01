'use strict'

function drawNum2(gNums2) {
    var randIdx = getRandomInt(0, gNums2.length)
    var num = gNums2[randIdx]
    gNums2.splice(randIdx, 1)
    return num
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}

function getCell(i, j) {
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    return elCell
}

function getEmptyLocations(board) {
    gEmptyLocations = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            gEmptyLocations.push({ i, j })
        }
    }
}
