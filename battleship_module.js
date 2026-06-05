

export function ship() {
    var shipLength = 0;
    var timesHit = 0;
    var shipSunk = false;
    var shipPosition = [];
    var shipTitle = "";
    var shipSpaceCoordinates = [];
    var hitCoordinates = [];

    function setShipTitle(title) {
        shipTitle = title;
    }

    function hit() {
        timesHit += 1;
        return timesHit;
    }

    function isSunk() {
        if (timesHit >= shipLength && timesHit !== 0) shipSunk = true;
        return shipSunk;
    }

    function setShipPos(tip, end) { // expect this format [x,y], [x,y]
        const evaluateArray = [tip[0], tip[1], end[0], end[1]];
        // console.log(evaluateArray);
        if (tip[0] !== end[0] && tip[1] !== end[1]) {
            // console.log(tip[0], end[0], tip[1], end[1]);
            throw new Error("invalid coordinates : diagonal");
        }
        for (let i = 0; i < evaluateArray.length; i++) {
            // console.log(evaluateArray[i]);
            if (evaluateArray[i] < 0 || evaluateArray[i] > 10) { // if the coordinates are OUTSIDE of the range
                throw new Error("invalid coordinates : out of map range");
            }
        }
        shipPosition = [tip, end]; // [[x,y], [x,y]]
        calcShipLength(); // automatically calc the length so we don't forget
        return shipPosition;
    }

    function getShipPos() {
        return shipPosition;
    }

    function calcShipLength() {
        if ((shipPosition[0][0] - shipPosition[1][0]) === 0) {
            shipLength = Math.abs(shipPosition[0][1] - shipPosition[1][1]) + 1; // Y
            calcShipSpace("Y");
        } else {
            shipLength = Math.abs(shipPosition[0][0] - shipPosition[1][0]) + 1; // X
            calcShipSpace("X");
        }
    }

    function calcShipSpace(axis) {
        shipSpaceCoordinates = []; //resets array so that if the function is run more than once it isn't stacking old data
        if (axis === "Y") {
            const shipStaticAxis = shipPosition[0][0]; // doesn't matter if its the tip or end because it is the same
            if (shipPosition[0][1] > shipPosition[1][1]) {
                // shipSpaceCoordinates.push([shipStaticAxis, shipPosition[1][1]])
                for (let i = 0; i < shipLength; i++) {
                    shipSpaceCoordinates.push([shipStaticAxis, shipPosition[0][1] - i]);
                }
            } else {
                // shipSpaceCoordinates.push([shipStaticAxis, shipPosition[0][1]])
                for (let i = 0; i < shipLength; i++) {
                    shipSpaceCoordinates.push([shipStaticAxis, shipPosition[0][1] + i]);
                }
            }
        } else if (axis === "X") {
            const shipStaticAxis = shipPosition[0][1]; // doesn't matter if its the tip or end because it is the same
            if (shipPosition[0][0] > shipPosition[1][0]) {
                for (let i = 0; i < shipLength; i++) {
                    shipSpaceCoordinates.push([shipPosition[0][0] - i, shipStaticAxis]);
                }
            } else {
                for (let i = 0; i < shipLength; i++) {
                    shipSpaceCoordinates.push([shipPosition[0][0] + i, shipStaticAxis]);
                }
            }
        }
        return shipSpaceCoordinates;
    }

    function getShipSpaceCoordinates() {
        // console.log(shipSpaceCoordinates);
        return shipSpaceCoordinates;
    }

    function getShipLength() {
        return shipLength;
    }

    function getShipTitle() {
        return shipTitle;
    }

    function addHitCoordinates(hitShot) {
        hitCoordinates.push(hitShot);
    }

    return { shipLength, timesHit, shipSunk, shipSpaceCoordinates, setShipTitle, hit, isSunk, setShipPos, getShipLength, getShipPos, calcShipLength, getShipSpaceCoordinates, getShipTitle, addHitCoordinates };
}

export function gameboard() {
    var shipList = [];
    var missedShots = [];
    var hitShots = []; // used for display purposes but also to check if a shot has ALREADY been hit before checking the ships

    function createShip(tip, end, title = null) {
        const newShip = ship();

        if (title != null) { // only set the title of the ship if the name is provided
            newShip.setShipTitle(title)
        };

        for (let i = 0; i < shipList.length; i++) {
            // console.log(shipList[i].getShipSpaceCoordinates());
            const shipCoordinates = shipList[i].getShipSpaceCoordinates();
            for (let e = 0; e < shipCoordinates.length; e++) { // iterates through the shipCoordinates of every ship
                if (shipCoordinates[e][0] === tip[0] && shipCoordinates[e][1] === tip[1] || shipCoordinates[e][0] === end[0] && shipCoordinates[e][1] === end[1]) { // if the new ship's position intersects with any ship then an error is thrown
                    throw new Error("ship space already taken by another ship");
                }
            }
        };
        newShip.setShipPos(tip, end);
        shipList.push(newShip);
        return shipList;
    }

    function recieveAttack(attackCoordinates) {
        for (let e = 0; e < missedShots.length; e++) { // iterates through the missed shots to see if you already attacked
            if (missedShots[e][0] === attackCoordinates[0] && missedShots[e][1] === attackCoordinates[1]) { // if this spot has already been shot at and missed, an error is thrown
                throw new Error("space has already been attacked : missed");
            }
        }

        for (let e = 0; e < hitShots.length; e++) { // iterates through the hit shots to see if you already attacked
            if (hitShots[e][0] === attackCoordinates[0] && hitShots[e][1] === attackCoordinates[1]) { // if this spot has already been shot at and hit, an error is thrown
                throw new Error("space has already been attacked : hit");
            }
        }

        // check the ships themselves to see if they got hit
        for (let i = 0; i < shipList.length; i++) {
            const shipCoordinates = shipList[i].getShipSpaceCoordinates();
            for (let e = 0; e < shipCoordinates.length; e++) { // iterates through the shipCoordinates of every ship
                if (shipCoordinates[e][0] === attackCoordinates[0] && shipCoordinates[e][1] === attackCoordinates[1]) { // if the new ship's position intersects with any ship then an error is thrown
                    if (shipList[i].getShipTitle() === "") {
                        var title = "Ship";
                    } else {
                        var title = shipList[i].getShipTitle();
                    }
                    console.log(title + " has been hit at: [" + attackCoordinates[0] + "," + attackCoordinates[1] + "]"); // prints to console
                    hitShots.push(attackCoordinates); // pushes the hit coordinates to the hitshots list
                    shipList[i].addHitCoordinates(attackCoordinates); // pushes the hit coordinates to the ship's hitshots list
                    shipList[i].hit(); //increases hit counter for ship
                    return true;
                }
            }
        }
        missedShots.push(attackCoordinates);
        return false;
    }

    function checkAllShipSunk() {
        // check the ships themselves to see if they got hit
        for (let i = 0; i < shipList.length; i++) {
            if (shipList[i].isSunk() === false) {
                return false;
            }
        } return true;
    }

    function getShipList() {
        return shipList;
    }

    return { createShip, getShipList, recieveAttack, checkAllShipSunk };
}

export function player() {
    const boardArray = [];
    const smallBoardArray = []
    const board = gameboard();
    var playerNumber = null;
    var playerType = "";

    function setPlayerType(type) {
        playerType = type;
    }

    function useBoard() {
        return board;
    }

    function setPlayerNumber(number){
        playerNumber = number;
    }

    function getPlayerNumber(){
        return playerNumber;
    }

    return { setPlayerType, useBoard, setPlayerNumber, getPlayerNumber, boardArray, smallBoardArray }
}

