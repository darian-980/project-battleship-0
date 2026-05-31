import { ship, gameboard, player } from "../battleship_module.js";
import "./styles.css";

function runGame() {

    const player1 = player();
    const player2 = player();



}

// runGame();

function calcBoardIndex(x, y) { //calculates the index of the plot rather than just iterating
    const Ycalc = (y - 1) * 10;
    const Xcalc = x - 1;
    const indexCalc = Xcalc + Ycalc;
    return indexCalc;
}

function displayPlot(x, y, newClassName = "hitClass") { //changes the classname of the plot to change the bg color
    const index = calcBoardIndex(x, y);
    boardArray[index].className = newClassName;
    boardArray[index].textContent = "hi";
    console.log(boardArray[index]);
}

const boardArray = [];

(function () {
    console.log("test");

    const grabBoard = document.getElementsByClassName("board")[0]; //grabs the first (and only) board in the array;

    var axisCounterX = 1;
    var axisCounterY = 1;

    for (let i = 0; i < 100; i++) { // construct base plots with coordinates
        const plot = document.createElement("div");
        plot.setAttribute("x", axisCounterX);
        plot.setAttribute("y", axisCounterY);
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

    displayPlot(3, 4);
    displayPlot(1, 4);
})();