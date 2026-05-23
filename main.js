

export function ship() {
    var shipLength = 0;
    var timesHit = 0;
    var shipSunk = false;
    var shipPosition = [];
    var shipTitle = "";
    var shipSpaceCoordinates = [];

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
        if (tip[0] !== end[0] && tip[1] !== end[1]){
            // console.log(tip[0], end[0], tip[1], end[1]);
            throw new Error ("invalid coordinates : diagonal");
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
        if (axis === "Y") {
            const shipStaticAxis = shipPosition[0][0]; // doesn't matter if its the tip or end because it is the same
            if (shipPosition[0][1] > shipPosition[1][1]) {
                // shipSpaceCoordinates.push([shipStaticAxis, shipPosition[1][1]])
                for (let i = 0; i < shipLength; i++) {
                    shipSpaceCoordinates.push([shipStaticAxis, shipPosition[1][1] + i]);
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
                    shipSpaceCoordinates.push([shipStaticAxis, shipPosition[0][0] + i]);
                }
            } else {
                for (let i = 0; i < shipLength; i++) {
                    shipSpaceCoordinates.push([shipStaticAxis, shipPosition[1][0] + i]);
                }
            }
        }
        return shipSpaceCoordinates;
    }

    function getShipSpaceCoordinates(){
        console.log(shipSpaceCoordinates);
        return shipSpaceCoordinates;
    }

    function getShipLength() {
        return shipLength;
    }

    return { shipLength, timesHit, shipSunk, hit, isSunk, setShipPos, getShipLength, getShipPos, calcShipLength, getShipSpaceCoordinates };
}

function gameboard() {
    var shipList = [];
}


