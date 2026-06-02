import { ship, gameboard, player } from "../battleship_module.js";
import "./styles.css";


function calcBoardIndex(x, y) { //calculates the index of the plot rather than just iterating
    const Ycalc = (y - 1) * 10;
    const Xcalc = x - 1;
    const indexCalc = Xcalc + Ycalc;
    return indexCalc;
}

function displayPlot(x, y, boardArray, newClassName = "hitClass") { //changes the classname of the plot to change the bg color
    const index = calcBoardIndex(x, y);
    boardArray[index].className = newClassName;
    boardArray[index].textContent = "hi"; //debugging
    boardArray[index].classList.remove("hoverGray");
    console.log(boardArray[index]);
}

function boardAttack(x, y, player) {
    if (player.useBoard().recieveAttack([x, y])) {
        displayPlot(x, y, player.boardArray, "hitClass");
    } else {
        displayPlot(x, y, player.boardArray, "missClass");
    };
}

function constructPlayerBoard(player) {

    const boardArray = player.boardArray; //takes the array from the player object and assigns it to boardArray
    const playerNum = player.getPlayerNumber();

    const grabBoard = document.querySelector(`#${CSS.escape(playerNum)}.board`) //grabs the div with the matching player number and has class board;

    console.log(player.getPlayerNumber())

    var axisCounterX = 1;
    var axisCounterY = 1;

    for (let i = 0; i < 100; i++) { // construct base plots with coordinates
        const plot = document.createElement("div");
        plot.setAttribute("x", axisCounterX);
        plot.setAttribute("y", axisCounterY);
        plot.setAttribute("class", "hoverGray");
        // plot.textContent = `${axisCounterX},${axisCounterY}`; // for debugging
        if (axisCounterX === 10) {
            axisCounterX = 1;
            axisCounterY += 1;
        } else {
            axisCounterX += 1;
        }
        grabBoard.appendChild(plot);
        boardArray.push(plot);
    }

    console.log(boardArray);

    console.log("index: " + calcBoardIndex(3, 4))

    // displayPlot(3, 4, boardArray);
    // displayPlot(1, 4, boardArray);
    // displayPlot(7, 4, boardArray, "missClass");

}


function runGame() {

    const player1 = player();
    player1.setPlayerNumber(1);

    const player2 = player();
    player2.setPlayerNumber(2);

    constructPlayerBoard(player1);
    constructPlayerBoard(player2);

    player1.useBoard().createShip([3, 3], [3, 5], "cruiser");
    player1.useBoard().createShip([4, 4], [4, 6], "battleship");

    player2.useBoard().createShip([8, 3], [3, 3], "cruiser");
    player2.useBoard().createShip([4, 2], [5, 2], "battleship");

    // console.log(player2.useBoard().recieveAttack([8, 3]));
    // console.log(player2.useBoard().getShipList()[0].getShipSpaceCoordinates());
    boardAttack(8, 3, player2)
    

};

runGame();