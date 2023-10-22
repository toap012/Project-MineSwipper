'use strict'
const MINE = '💣'
const MARK = '🚩'
const gSmilys = {
    win: '🤩',
    lose: '🤯',
    default: '😄'
}
var gHp = '❤❤❤'
var gHints = '💡💡💡'
var gElSmily = document.querySelector('.smily')
gElSmily.innerText = gSmilys.default
var gElHp = document.querySelector('.healthPoints')
gElHp.innerText = gHp
var gElHintSpan = document.querySelector('.hints span')
gElHintSpan.innerText += gHints
var gBoard
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLevel = {
    size: 4,
    mines: 2
}
var gHealthPoints = 3
var gHintsCount = 3
var gFirstClick = false
var gTimerInterval
var gCurrScore = 0
var gTens = 0
var gSeconds = 0
var gAppendSeconds = document.getElementById("seconds")
var gAppendTens = document.getElementById("tens")
var gHintActivated = false
var gWinnersBoard
var gWinnersEasy = []
var gWinnersMeduim = []
var gWinnersHard = []
var gGamewon = false
var gSafeClicks = 3
var gMegaHint = 1
var gMegaHintIsOn = false
var gMegaHintPos = []
var gMegaHintCounter = 0
var gElSafeClicksSpan = document.querySelector('.safeClick span')
gElSafeClicksSpan.innerText = 'Clicks Remains: ' + gSafeClicks
var gElMegaHintSpan = document.querySelector('.megaHint span')
gElMegaHintSpan.innerText = 'Clicks Remains: ' + gMegaHint



function onInit() {
    gMegaHintCounter = 0
    gMegaHint = 1
    gElMegaHintSpan.innerText = 'Clicks Remains: ' + gMegaHint
    gElSmily.innerHTML = gSmilys.default
    gGame.isOn = true
    gGamewon = false
    gGame.shownCount = 0
    gSafeClicks = 3
    gMegaHint = 1
    gMegaHintIsOn = false
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gTens = 0
    gSeconds = 0
    gFirstClick = false
    gHealthPoints = 3
    gHp = '❤❤❤'
    gHints = '💡💡💡'
    gElSafeClicksSpan.innerText = 'Clicks Remains: ' + gSafeClicks
    gElHintSpan.innerHTML = 'Hints Left: ' + gHints
    gElHp.innerHTML = gHp
    gAppendSeconds.innerHTML = '00'
    gAppendTens.innerHTML = '00'
    gHintsCount = 3
    gHintActivated = false
    gBoard = buildBoard()
    renderBoard(gBoard)
    gCurrScore = gTimerInterval
    clearInterval(gTimerInterval)
    gTimerInterval = setInterval(StartTimer, 1000)
    getResults(gLevel.size)
}

function StartTimer() {
    gSeconds++
    if (gSeconds <= 9) {
        gAppendSeconds.innerHTML = '0' + gSeconds
    }
    if (gSeconds > 9) {
        gAppendSeconds.innerHTML = gSeconds
    }
    if (gSeconds > 59) {
        gTens++
        gAppendTens.innerHTML = '0' + gTens
        gSeconds = 0
        gAppendSeconds.innerHTML = '0' + 0
    }
    if (gTens > 9) {
        gAppendTens.innerHTML = gTens
    }
}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.size; i++) {
        board.push([])
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = getCell(i, j)
        }
    }
    return board
}

function getResults(level) {
    var currLevelWinners
    var list
    switch (level) {
        case 4:
            currLevelWinners = JSON.parse(window.localStorage.getItem('scoreEasy'))
            list = gWinnersEasy
            list = gWinnersEasy
            break
        case 8:
            currLevelWinners = JSON.parse(window.localStorage.getItem('scoreMeduim'))
            list = gWinnersMeduim
            break
        case 12:
            currLevelWinners = JSON.parse(window.localStorage.getItem('scoreHard'))
            list = gWinnersHard
            break
        default: currLevelWinners = JSON.parse(window.localStorage.getItem('scoreEasy'))
            list = gWinnersEasy
    }
    if (gGamewon) {
        list.push(currLevelWinners)
    }
    gWinnersBoard = buildWinnersBoard(list)
    renderWinnersBoard(gWinnersBoard)
}

function buildWinnersBoard(winners) {
    var board = []
    for (var i = 0; i < winners.length + 1; i++) {
        board.push([])
        if (!winners[0]) break
        for (var j = 0; j < 2; j++) {
            if (i === 0) continue
            if (!winners[i - 1].name || !winners[i - 1].score) continue
            var currCell = board[i][j]
            if (j === 0) {
                currCell = winners[i - 1].name
            } else if (j === 1) {
                currCell = winners[i - 1].score
            }
            board[i][j] = currCell
        }

    }
    board[0][0] = 'Name'
    board[0][1] = 'Time'
    console.table(board)
    return board
}

function MinesNegsCounter(mat, rowIdx, colIdx) {
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

function showNegsAround(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j]
            // console.log(currCell)
            if (currCell.isShown === true) continue
            var currElCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            currElCell.classList.add('shown')
            currElCell.innerText = currCell.str
            currCell.isShown = true
            gGame.shownCount++
            if (currCell.minesAroundCount === 0) {
                showNegsAround(i, j)
            }
        }
    }
}

function checkGameWon() {
    var diff = gLevel.size * gLevel.size - gLevel.mines
    if (gGame.shownCount === diff && gGame.markedCount === gLevel.mines) {
        gGame.isOn = false
        gGamewon = true
        gElSmily.innerHTML = gSmilys.win
        revealMines()
        gCurrScore = gAppendTens.innerHTML + ':' + gAppendSeconds.innerHTML
        setTimeout(setWinnerResult, 2500, gCurrScore)
        clearInterval(gTimerInterval)
    }
}

function gameOver() {
    revealMines()
    _sadSmily()
    console.log('try again')
    // clearInterval(gTimerInterval)
    // showModal()
    gGame.isOn = false
    // setTimeout(onInit, 5000)


}

function reavealNegs(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            var currCell = gBoard[i][j]
            var currElCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            if (currElCell.classList.contains('shown')) continue
            currElCell.classList.toggle('revealed')
            if (!currCell.isShown) {
                if (currCell.isHinted && !currCell.isMarked) {
                    currCell.isHinted = false
                    currElCell.innerText = ''
                } else if (currCell.isHinted && currCell.isMarked) {
                    currCell.isHinted = false
                    currElCell.innerText = MARK
                } else {
                    currCell.isHinted = true
                    currElCell.innerText = currCell.str
                }

            }
        }
    }
}

function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            var currElCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            if (currCell.isMine) currElCell.innerText = currCell.str
        }
    }
}

function setWinnerResult(res) {
    // console.log(res)
    var winnerName = prompt('Congratz! you won! what is your name?')
    var Winner = { name: winnerName, score: res, level: gLevel.size, id: makeId(3) }
    switch (gLevel.size) {
        case 4:
            window.localStorage.setItem('scoreEasy', JSON.stringify(Winner))
            break
        case 8:
            window.localStorage.setItem('scoreMeduim', JSON.stringify(Winner))
            break
        case 12:
            window.localStorage.setItem('scoreHard', JSON.stringify(Winner))
            break
    }
    getResults(gLevel.size)
}

function setMines(rowIdx, colIdx) { // set mines in gboard
    var mineCounter = 0
    while (mineCounter < gLevel.mines) {
        var randRowIdx = getRandomInt(0, gLevel.size - 1)
        var randColIdx = getRandomInt(0, gLevel.size - 1)
        if (rowIdx === randRowIdx && randColIdx === colIdx) continue
        if (gBoard[randRowIdx][randColIdx].isMine) continue
        gBoard[randRowIdx][randColIdx].isMine = true
        mineCounter++
    }
    GetCellsStr()
}

function GetCellsStr() { // places the stirng in gBoard cells
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine === true) {
                gBoard[i][j].str = MINE
                continue
            }
            var MinesNegsCount = MinesNegsCounter(gBoard, i, j)
            gBoard[i][j].minesAroundCount = MinesNegsCount
            if (MinesNegsCount === 0) continue
            gBoard[i][j].str = MinesNegsCount.toString()
        }
    }
}

// render functions //

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < board[0].length; j++) {
            const cellStr = board[i][j].str
            strHTML += `\t<td 
                            data-i="${i}" data-j="${j}"
                             class="cell ${cellStr}" 
                            onclick="onCellClicked(this, ${i}, ${j})"
                            onmouseup="onCellMarked(event, this)"> 
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    const elCells = document.querySelector('.board')//Tbody class name
    elCells.innerHTML = strHTML
}

function renderHints(i, j) {
    if (gHintsCount === 0) {
        return
    }
    gHintsCount--
    reavealNegs(i, j)
    setTimeout(reavealNegs, 1000, i, j)
    // console.log(gHintsCount)
    gHintActivated = false
    gElHintSpan.innerText = 'Hints Left: ' + gHints.slice(0, gHintsCount * 2)
}

function renderWinnersBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < board[0].length; j++) {
            var cellStr = board[i][j]
            var className
            className = 'winnerCell'
            if (i === 0 && j === 0 || i === 0 && j === 1) className = 'WinnersHeader'
            strHTML += `\t<td 
                             class="${className}"> ${cellStr}
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    const elWinnersCells = document.querySelector('.winnersBoard')//Tbody class name
    elWinnersCells.innerHTML = strHTML
}

// onClick functions //

function onFirstClick(rowIdx, colIdx) {
    setMines(rowIdx, colIdx)
}

function onSmilyClick() {
    onInit()
}

function onChooseLevel(rowCount, minesCount) {
    gLevel.mines = minesCount
    gLevel.size = rowCount
    onInit()

}

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (cell.isShown || cell.isMarked || !gGame.isOn) {
        return
    }

    if (!gFirstClick) {
        onFirstClick(elCell, i, j)
        gFirstClick = true
    }
    if (gMegaHintIsOn) {
        var currCellPos = { i, j }
        gMegaHintPos.push(currCellPos)
        gMegaHintCounter++
        if (gMegaHintCounter === 2) {
            onMegaHint(gMegaHintPos)
            gMegaHintIsOn = false
            gMegaHint--
            gElMegaHintSpan.innerText = 'Clicks Remains: ' + gMegaHint

        }
        return
    }
    if (gHintActivated) {
        renderHints(i, j)
        if (gHintsCount === 0) {
            gElHintSpan.innerText = 'No Hints Left'
            gHintActivated = false
            return
        }
        return
    }

    if (cell.isMine === true) {
        elCell.innerText = cell.str
        gHealthPoints--
        cell.isShown = true
        gElHp.innerText = gHp.slice(0, gHealthPoints)
        if (gHealthPoints === 0) {
            gameOver()
            return
        } else {
            _sadSmily()
            setTimeout(_normalSmily, 1000)

        }
        return
    }
    // Model
    cell.isShown = true
    // DOM
    elCell.innerText = cell.str
    gGame.shownCount++
    elCell.classList.add('shown')
    if (cell.minesAroundCount === 0) {
        showNegsAround(i, j)
    }
    checkGameWon()
}

function onCellMarked(ev, elCell) {
    if (!gGame.isOn) return
    elCell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
    if (ev.button === 2 && !elCell.classList.contains('shown')) {
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
        checkGameWon()
    }
}

function onSafeClick() {
    var spoted = false
    if (gSafeClicks === 0) return
    while (!spoted) {
        var randRowIdx = getRandomInt(0, gBoard.length)
        var randColIdx = getRandomInt(0, gBoard.length)
        var currCell = gBoard[randRowIdx][randColIdx]
        if (currCell.isMine || currCell.isShown) continue
        var currElCell = document.querySelector(`[data-i="${randRowIdx}"][data-j="${randColIdx}"]`)
        currElCell.classList.add('safe')
        setTimeout(() => {
            currElCell.classList.remove('safe')
        }, 1000);
        spoted = true
        gSafeClicks--
        gElSafeClicksSpan.innerHTML = 'Clicks Remains: ' + gSafeClicks
        return
    }

}

function onMegaHintClick() {
    if (gMegaHintCounter !== 2) {
        gMegaHintIsOn = true
    }
    return

}

function onMegaHint(pos) {
    var from = pos[0]
    var to = pos[1]
    for (var i = from.i; i < to.i + 1; i++) {
        for (var j = from.j; j < to.j + 1; j++) {
            var currCell = gBoard[i][j]
            var currElCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            currElCell.classList.add('revealed')
            currElCell.innerHTML = currCell.str
        }
    }
    setTimeout(() => {
        for (var i = from.i; i < to.i + 1; i++) {
            for (var j = from.j; j < to.j + 1; j++) {
                var currCell = gBoard[i][j]
                var currElCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                currElCell.classList.remove('revealed')
                currElCell.innerHTML = ''
            }
        }
    }, 2000);


}

// local functions //

function _sadSmily() {
    gElSmily.innerHTML = gSmilys.lose
}

function _normalSmily() {
    gElSmily.innerHTML = gSmilys.default
}

function _getHint() {
    gHintActivated = true
}

