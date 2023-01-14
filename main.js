const board = []
const rows = 10
const columns = 10 

const mineCount = 10
let mineLocation = []

let tilesClicked = 0 
let flagEnabled = false

let gameOver = false

window.onload = function() {
    startGame()

}

function setMines() {


    let minesLeft = mineCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows)
        let c = Math.floor(Math.random() * columns)
        let id = r.toString() + "-" + c.toString()

        if (!mineLocation.includes(id)) {
            mineLocation.push(id)
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById('mines-count').innerText = mineCount
    document.getElementById("flag-button").addEventListener('click', setFlag)
    setMines()


    //board
    for (let r = 0; r < rows; r++) {
        let row = []
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement('div')
            tile.id = r.toString() + "-" + c.toString()
            tile.addEventListener("click", clickTile)
            document.getElementById("board").append(tile)
            row.push(tile)
        }
        board.push(row)
    }
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}


function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if(tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (mineLocation.includes(tile.id)) {
        // alert("GAME OVER")
        gameOver = true;
        revealMines();
        return;

    }

    let coords = tile.id.split("-")
    let r = parseInt(coords[0])
    let c = parseInt(coords[1])
    checkMine(r, c)
     

}

function revealMines() {
    for (let r = 0; r < rows; r++ ) {
        for (let c= 0; c < columns; c++) {
            let tile = board[r][c]
            if (mineLocation.includes(tile.id)) {
                tile.innerText = "💣"
                tile.style.backgroundColor = "red"

            }
        } 
    }

}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked")
    tilesClicked += 1;

    let mineFound = 0;

    //top 3
    mineFound += checkTile(r-1, c-1);      //top left
    mineFound += checkTile(r-1, c);      //top
    mineFound += checkTile(r-1, c+1);      //top right

    //left and right
    mineFound += checkTile(r, c-1);      //left
    mineFound += checkTile(r, c+1);      //right

    //bottom 3
    mineFound += checkTile(r+1, c-1);      //bottomleft
    mineFound += checkTile(r+1, c);      //bottom
    mineFound += checkTile(r+1, c+1);     //bottom right

    if (mineFound > 0) {
        board[r][c].innerText = mineFound;
        board[r][c].classList.add("x" + mineFound.toString())

    }
    else {
        //top 3
        checkMine(r-1, c-1);    //top left
        checkMine(r-1, c);      //top
        checkMine(r-1, c+1);    //top right

        //left and right
        checkMine(r, c-1);      //left
        checkMine(r, c+1)       //right

        //bottom 3
        checkMine(r+1, c-1);    //bottom left
        checkMine(r+1, c);      //bottom
        checkMine(r+1, c+1);    //bottom right
    }

    if (tilesClicked == rows * columns - mineCount) {
        document.getElementById("mines-count").innerText = "cleared";
        gameOver = true;
    }



}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (mineLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;

}
