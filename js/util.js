'use strict'
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min 
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('')
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function countNegs(mat, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
      if (i < 0 || i > mat.length - 1) continue
      for (var j = colIdx - 1; j <= colIdx + 1; j++) {
        if (j < 0 || j > mat[0].length - 1) continue
        if (i === rowIdx && j === colIdx) continue
        var currCell = mat[i][j]
        if (currCell.content === '$') count++ //dolar should change to the specified game content
      }
    }
    return count
  }

  function renderCinema() {//supposed to get board could be global
    var strHTML = ''

    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            const cell = gCinema[i][j]
            // // For a cell of type SEAT add seat class
            // var className = (cell.isSeat) ? 'seat' : ''

            // // For a cell that is booked add booked class
            // if (cell.isBooked) {
            //     className += ' booked'
            // }
            // Add a seat title
            const title = `Seat: ${i + 1}, ${j + 1}` //hover will popup a little window

            strHTML += `\t<td title="${title}"
                            data-i="${i}" data-j="${j}"
                             class="cell ${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }

    const elSeats = document.querySelector('.cinema-seats')//Tbody class name
    elSeats.innerHTML = strHTML
}
function createBoard() {
    var board = []
    for (var i = 0; i < 8; i++) {
        board.push([])
        for (var j = 0; j < 8; j++) {
            board[i][j] = (Math.random() > 0.5) ? LIFE : '' //depends on game (50% to have the "LIFE")
        }
    }
    return board
    //after this func, should come a render board func.
}

//   setTimeout(() => {
    
//   }, 2000)

function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}