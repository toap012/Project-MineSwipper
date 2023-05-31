'use strict'
const MINE = '💣'
const MARK = '🚩'

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

function onInit() {
    gBoard = buildBoard()
    console.table(gBoard)
    renderBoard(gBoard)

}

function buildBoard() {
    var board = []
    for (var i = 0; i < 4; i++) {
        board.push([])
        for (var j = 0; j < 4; j++) {
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
    board[1][1].isMine = true
    board[3][2].isMine = true
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
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
    if (!cell.isMarked) {
        elCell.innerText = cell.str
        if (cell.isMine === true) {
            console.log('die')
        } else if (cell.isShown === false) {
            cell.isShown = true
            if (cell.minesAroundCount === 0) {
                showNegsAround(elCell, i, j)
            }
            gGame.shownCount++
            elCell.classList.add('shown')
            console.log(gGame.shownCount)
            checkGameOver()
        }
    } else {
        return
    }
}

function showNegsAround(elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j]
            var currElCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            gGame.shownCount++
            currElCell.classList.add('shown')
            currElCell.innerText = currCell.str
            currCell.isMarked = true
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
        checkGameOver()
    }
}

function checkGameOver() {
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES && gGame.markedCount === gLevel.MINES) {
        gGame.isOn = false
        // showModal()
        console.log('yay')
    }
}

