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

function constructAxis(player) {
    const playerNum = player.getPlayerNumber();

    const axisX = document.querySelector(`#${CSS.escape(playerNum)}.axisX`) //grabs x visible axis
    const axisY = document.querySelector(`#${CSS.escape(playerNum)}.axisY`) //grabs y visible axis

    var counter = 0;

    for (let i = 0; i < 10; i++) {
        counter = i + 1;
        const axisPlotX = document.createElement("div");
        const axisPlotY = document.createElement("div");
        axisPlotX.textContent = `${counter}`;
        axisPlotY.textContent = `${counter}`;
        axisX.appendChild(axisPlotX);
        axisY.appendChild(axisPlotY);
    }
}


function constructPlayerBoard(player, playerList) {

    var player1Use = false;
    if (player === playerList[0]) player1Use = true; //checks if the player is Player 1;

    const boardArray = player.boardArray; //takes the array from the player object and assigns it to boardArray
    const smallBoardArray = player.smallBoardArray;
    const playerNum = player.getPlayerNumber();
    const grabColumn = document.querySelector(`#${CSS.escape(playerNum)}.vertical`)
    const grabTurnDiv = document.getElementsByClassName("passTurn")[0];
    const passButton = document.querySelector(`#${CSS.escape(playerNum)}.passButton`);

    const grabBoard = document.querySelector(`#${CSS.escape(playerNum)}.board`) //grabs the div with the matching player number and has class board;
    
    constructAxis(player); //constructs axises
    // console.log(player.getPlayerNumber())

    var axisCounterX = 1;
    var axisCounterY = 1;

    for (let i = 0; i < 100; i++) { // construct base plots with coordinates
        const x = axisCounterX;
        const y = axisCounterY;

        const plot = document.createElement("div");
        plot.setAttribute("x", x);
        plot.setAttribute("y", y);
        if (player1Use === true) plot.setAttribute("class", "hoverGray");

        plot.attackHandler = function () { //we have to define a function with a direct reference so it can recognized outside of the scope
            if (turnSwitch !== player.getPlayerNumber()) return;
            if (player1Use === true && player2Type === "CPU") {
                const generateAttack = CPUAttack(playerList[1]);
                const xAttack = generateAttack[0];
                const yAttack = generateAttack[1];

                boardAttack(x, y, player);
                boardAttack(xAttack, yAttack, playerList[1]);
                if (playerList[1].useBoard().checkAllShipSunk()) { // once the player goes check if their ships are sunk and end game
                    endGame(playerList[1]);
                }
            } else {
                passButton.style.visibility = 'visible';
                boardAttack(x, y, player);
                switchTurn();
            }
            if (player.useBoard().checkAllShipSunk()) { // once the player goes check if their ships are sunk and end game
                endGame(player);
            }

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

    passButton.addEventListener('click', function () {
        passButton.style.visibility = 'hidden'; // hide button for next time once it's pressed
        grabColumn.style.display = 'none';
        grabTurnDiv.style.display = 'flex';
    })


    displayShips(player);
}

function deactivateHover(player) { //unused
    boardArray[index].removeEventListener('click', boardArray[index].attackHandler);
}

function swapRealPlayerTurns() {
    const grabTurnDiv = document.getElementsByClassName("passTurn")[0];
    const grabColumnPlayer1 = document.querySelector(`#${CSS.escape(1)}.vertical`);
    const grabColumnPlayer2 = document.querySelector(`#${CSS.escape(2)}.vertical`);

    grabTurnDiv.style.display = 'none';

    if (turnSwitch === 2) {
        grabColumnPlayer1.style.display = 'none';
        grabColumnPlayer2.style.display = 'flex';
    } else {
        grabColumnPlayer1.style.display = 'flex';
        grabColumnPlayer2.style.display = 'none';
    }
}

function CPUAttack(player) {
    const missedShots = player.useBoard().missedShots;
    const hitShots = player.useBoard().hitShots;
    const allShots = [...missedShots, ...hitShots]; //grab all shots that the CPU has already taken

    var generateShot = [generateNum(), generateNum()];
    var LoopLeft = 1;

    while (LoopLeft > 0) {
        LoopLeft -= 1;
        for (let i = 0; i < allShots.length; i++) {
            if (allShots[i][0] === generateShot[0] && allShots[i][1] === generateShot[1]) {
                generateShot = [generateNum(), generateNum()]; //regenerate shot
                LoopLeft += 1;
                break;
            }
        }
    }

    console.log(allShots)

    return generateShot;
}

function generateNum() { // random number from 1 - 10
    return Math.floor(Math.random() * (11 - 1) + 1);
}

function endGame(player) {
    // console.log("game end")

    const winnerContainer = document.getElementsByClassName("winnerContainer")[0];
    const regularContainer = document.getElementsByClassName("container")[0];

    const playerNum = player.getPlayerNumber();
    const grabBoard = document.querySelector(`#${CSS.escape(playerNum)}.fourAxisGrid`) //grabs the div with the matching player number and has class board;

    const verticalDiv = document.createElement("div");
    verticalDiv.setAttribute("class", "verticalWin");

    const losingText = document.createElement("p");
    losingText.textContent = "Player " + playerNum + " wins!"

    regularContainer.style.display = 'none'; // hide all the gameboards
    winnerContainer.appendChild(verticalDiv); //add vertical div to the container
    verticalDiv.appendChild(losingText); // add losing text to the new container
    verticalDiv.appendChild(grabBoard); // add losing board to the new container
    winnerContainer.style.display = 'block'; //unhide the winnerContainer
}

function hookButtons() { //add buttons with functionality to start screen
    const realPlayerButton = document.querySelector(`#${CSS.escape("player")}.button`);
    const CPUbutton = document.querySelector(`#${CSS.escape("CPU")}.button`);
    const gameStartContainer = document.getElementsByClassName("gameStart")[0];
    const regularContainer = document.getElementsByClassName("container")[0];
    const TurnButton = document.getElementById("turn");

    const player2vertical = document.querySelector(`#${CSS.escape("2")}.vertical`);

    realPlayerButton.addEventListener("click", function () {
        retrievePlayerType(realPlayerButton);
        gameStartContainer.style.display = 'none';
        regularContainer.style.display = 'flex';
        player2vertical.style.display = 'none'; //only hides player board 2 ON START
        // HIDE THE GAMESTART CONTAINER AND SHOW THE GAME CONTAINER
    });

    CPUbutton.addEventListener("click", function () {
        retrievePlayerType(CPUbutton);
        gameStartContainer.style.display = 'none';
        regularContainer.style.display = 'flex';
    });

    TurnButton.addEventListener("click", function () {
        swapRealPlayerTurns();
    })


}

function retrievePlayerType(button) { //retrieve and assign the playertype based on the button pressed
    const playerType = button.getAttribute("id");
    player2Type = playerType;
}


var turnSwitch = 1; //global variable
var player2Type = null; //global variable
var player1Set = false; //changes once player 1 is set
var playerList = [];

function switchTurn() {
    if (turnSwitch === 1) turnSwitch = 2;
    else turnSwitch = 1;
}

function runGame() {

    const player1 = player();
    player1.setPlayerNumber(1);

    const player2 = player();
    player2.setPlayerNumber(2);

    hookButtons();

    player1.useBoard().createShip([3, 3], [3, 5], "cruiser");
    player1.useBoard().createShip([4, 4], [4, 6], "battleship");

    player2.useBoard().createShip([8, 3], [3, 3], "cruiser");
    player2.useBoard().createShip([4, 2], [5, 2], "battleship");

    playerList = [player1, player2];

    constructPlayerBoard(player1, playerList);
    constructPlayerBoard(player2, playerList);




    // console.log(player2.useBoard().recieveAttack([8, 3]));
    // console.log(player2.useBoard().getShipList()[0].getShipSpaceCoordinates());
    boardAttack(8, 3, player2)
    boardAttack(8, 3, player1)

    console.log(CPUAttack(player2));


};

runGame();