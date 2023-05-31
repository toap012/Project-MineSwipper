'use strict'
const MINE = '💣'
const MARK = '🚩'
const gSmilys = {
    win: '🤩',
    lose: '🤯',
    default: '😄'
}
var gElSmily = document.querySelector('h2 span')
gElSmily.innerHTML = gSmilys.default

var gBoard
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gTimerInterval
var gSconds = 0
var gTens = 0
var gAppendTens = document.getElementById("tens")
var gAppendSeconds = document.getElementById("seconds")



function onInit() {
    gElSmily.innerHTML = gSmilys.default
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gBoard = buildBoard()
    console.table(gBoard)
    renderBoard(gBoard)
    gTimerInterval = setInterval(StartTimer, 10)



}
function StartTimer() {
    gTens++
    if (gTens <= 9) {
        gAppendTens.innerHTML = '0' + gTens
    }
    if (gTens > 9) {
        gAppendTens.innerHTML = gTens
    }
    if (gTens > 99) {
        gSconds++
        gAppendSeconds.innerHTML = '0' + gSconds
        gTens = 0
        gAppendTens.innerHTML = '0' + 0
    }
    if (gSconds > 9) {
        gAppendSeconds.innerHTML = gSconds
    }
}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                pos: { i, j },
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                str: ''
            }
            board[i][j] = cell

        }
    }
    console.table(board)
    var counter = 0
    while (counter < gLevel.MINES) {
        var randRowIdx = getRandomInt(0, gLevel.SIZE - 1)
        var randColIdx = getRandomInt(0, gLevel.SIZE - 1)
        // console.log(randRowIdx, randColIdx)
        // console.log(board[randRowIdx][randColIdx])
        if (board[randRowIdx][randColIdx].isMine === false) {
            board[randRowIdx][randColIdx].isMine = true
            counter++
        } else {
            continue
        }


    }
    // board[1][1].isMine = true
    // board[3][2].isMine = true
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (board[i][j].isMine === true) {
                board[i][j].str = MINE
                continue
            }
            var MinesNegsCount = setMinesNegsCount(board, i, j)
            board[i][j].minesAroundCount = MinesNegsCount
            board[i][j].str = MinesNegsCount.toString()
        }
    }
    return board
}
function chooseLevel(rowCount, minesCount) {
    // console.log(rowCount)
    gLevel.MINES = minesCount
    gLevel.SIZE = rowCount
    gBoard = buildBoard()
    console.table(gBoard)
    renderBoard(gBoard)
}

function setMinesNegsCount(mat, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = mat[i][j]
            if (currCell.isMine === true) count++
        }
    }
    return count
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < board[0].length; j++) {
            const cellStr = board[i][j].str
            strHTML += `\t<td 
                            data-i="${i}" data-j="${j}"
                             class="cell ${cellStr} noContextMenu" 
                            onclick="onCellClicked(this, ${i}, ${j})"
                            onmouseup="onCellMarked(event, this)"
                             > 
                            
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    const elCells = document.querySelector('.board')//Tbody class name
    elCells.innerHTML = strHTML
    console.log(elCells)
}

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (cell.isMine === true) {
        gameOver()
        return
    }
    if (!cell.isMarked && !cell.isShown) {
        elCell.innerText = cell.str
        cell.isMarked = true
        cell.isShown = true
        gGame.shownCount++
        elCell.classList.add('shown')

    }
    if (cell.minesAroundCount === 0) {
        showNegsAround(i, j)
    }
    console.log(gGame.shownCount)
    checkGameWon()
}


function showNegsAround(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j]
            console.log(currCell)
            if (currCell.isMarked === true) continue
            var currElCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            currElCell.classList.add('shown')
            currElCell.innerText = currCell.str
            currCell.isMarked = true
            gGame.shownCount++
            if (currCell.minesAroundCount === 0) {
                showNegsAround(i, j)
            }
        }
    }
}

function onCellMarked(ev, elCell) {
    elCell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
    if (ev.button === 2 && !elCell.classList.contains('shown')) {
        console.log('marked')
        console.log(elCell)
        var i = elCell.dataset.i
        var j = elCell.dataset.j
        if (gBoard[i][j].isMine === true) {
            if (gBoard[i][j].isMarked === false) {
                gGame.markedCount++
                elCell.innerHTML = MARK
                elCell.classList.add('marked')
                gBoard[i][j].isMarked = true
            } else {
                gGame.markedCount--
                gBoard[i][j].isMarked = false
                elCell.classList.remove('marked')
                elCell.innerHTML = ''
            }
        } else {
            if (gBoard[i][j].isMarked === false) {
                elCell.innerHTML = MARK
                elCell.classList.add('marked')
                gBoard[i][j].isMarked = true
            } else {
                gBoard[i][j].isMarked = false
                elCell.classList.remove('marked')
                elCell.innerHTML = ''

            }


        }
        console.log(gGame.markedCount)
        checkGameWon()
    }
}

function checkGameWon() {
    var diff = gLevel.SIZE * gLevel.SIZE - gLevel.MINES
    if (gGame.shownCount === diff && gGame.markedCount === gLevel.MINES) {
        gGame.isOn = false
        // showModal()
        gElSmily.innerHTML = gSmilys.win
        console.log('yay')
        setTimeout(onInit, 5000)
    }
}

function gameOver() {
    gElSmily.innerHTML = gSmilys.lose
    console.log('try again')
    // showModal()
    gGame.isOn = false
    setTimeout(onInit, 5000)


}
function timerStop() {

}


