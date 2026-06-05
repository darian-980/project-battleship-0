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
    boardArray[index].classList.add(newClassName);
    // boardArray[index].textContent = "hi"; //debugging
    boardArray[index].classList.remove("hoverGray");
    boardArray[index].removeEventListener('click', boardArray[index].attackHandler); //remove the click once the area has been clicked
    // console.log(boardArray[index]);
}

function boardAttack(x, y, player) {
    if (player.useBoard().recieveAttack([x, y])) {
        displayPlot(x, y, player.boardArray, "hitClass");
        displayPlot(x, y, player.smallBoardArray, "hitClass");
    } else {
        displayPlot(x, y, player.boardArray, "missClass");
        displayPlot(x, y, player.smallBoardArray, "missClass");
    };
}

function displayShips(player) { //used to display friendly ships
    const shipList = player.useBoard().getShipList();
    for (let i = 0; i < shipList.length; i++) {
        for (let o = 0; o < shipList[i].getShipSpaceCoordinates().length; o++) {
            const x = shipList[i].getShipSpaceCoordinates()[o][0];
            const y = shipList[i].getShipSpaceCoordinates()[o][1];

            const index = calcBoardIndex(x, y);
            const smallBoardArray = player.smallBoardArray;
            smallBoardArray[index].classList.remove("non-ship-location");
            smallBoardArray[index].className = "ship-location";
        }
    }

}


function constructPlayerBoard(player) {

    const boardArray = player.boardArray; //takes the array from the player object and assigns it to boardArray
    const smallBoardArray = player.smallBoardArray;
    const playerNum = player.getPlayerNumber();

    const grabBoard = document.querySelector(`#${CSS.escape(playerNum)}.board`) //grabs the div with the matching player number and has class board;

    // console.log(player.getPlayerNumber())

    var axisCounterX = 1;
    var axisCounterY = 1;

    for (let i = 0; i < 100; i++) { // construct base plots with coordinates
        const x = axisCounterX;
        const y = axisCounterY;

        const plot = document.createElement("div");
        plot.setAttribute("x", x);
        plot.setAttribute("y", y);
        plot.setAttribute("class", "hoverGray");

        plot.attackHandler = function () { //we have to define a function with a direct reference so it can recognized outside of the scope
            if (turnSwitch !== player.getPlayerNumber()) return;
            boardAttack(x, y, player);
            switchTurn();
        };

        plot.addEventListener('click', plot.attackHandler);
        grabBoard.appendChild(plot);
        boardArray.push(plot);

        /////// minature board for reference

        const grabSmallBoard = document.querySelector(`#${CSS.escape(playerNum)}.small-board`);
        const smallPlot = document.createElement("div");
        smallPlot.setAttribute("x", x);
        smallPlot.setAttribute("y", y);
        smallPlot.setAttribute("class", "non-ship-location");
        grabSmallBoard.appendChild(smallPlot);
        smallBoardArray.push(smallPlot);

        // plot.textContent = `${axisCounterX},${axisCounterY}`; // for debugging
        if (axisCounterX === 10) {
            axisCounterX = 1;
            axisCounterY += 1;
        } else {
            axisCounterX += 1;
        }

    }

    displayShips(player);

    // console.log(boardArray);

    // console.log("index: " + calcBoardIndex(3, 4))

    // displayPlot(3, 4, boardArray);
    // displayPlot(1, 4, boardArray);
    // displayPlot(7, 4, boardArray, "missClass");

}

function deactivateHover(player) {
    boardArray[index].removeEventListener('click', boardArray[index].attackHandler);
}

var turnSwitch = 1; //global variable

function switchTurn() {
    if (turnSwitch === 1) turnSwitch = 2;
    else turnSwitch = 1;
}

function runGame() {

    const player1 = player();
    player1.setPlayerNumber(1);

    const player2 = player();
    player2.setPlayerNumber(2);

    player1.useBoard().createShip([3, 3], [3, 5], "cruiser");
    player1.useBoard().createShip([4, 4], [4, 6], "battleship");

    player2.useBoard().createShip([8, 3], [3, 3], "cruiser");
    player2.useBoard().createShip([4, 2], [5, 2], "battleship");

    constructPlayerBoard(player1);
    constructPlayerBoard(player2);

    const playerList = [player1, player2];


    // console.log(player2.useBoard().recieveAttack([8, 3]));
    // console.log(player2.useBoard().getShipList()[0].getShipSpaceCoordinates());
    boardAttack(8, 3, player2)
    boardAttack(8, 3, player1)


};

runGame();