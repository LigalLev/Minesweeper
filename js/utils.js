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

// function copyMat(mat) {
//     var newMat = []
//     for (var i = 0; i < mat.length; i++) {
//         newMat[i] = []
//         for (var j = 0; j < mat[0].length; j++) {
//             newMat[i][j] = mat[i][j]
//         }
//     }
//     return newMat
// }