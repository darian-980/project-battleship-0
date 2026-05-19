

export function ship() {
    var shipLength = 0;
    var timesHit = 0;
    var shipSunk = false;
    var shipPosition = [];

    function hit() {
        timesHit += 1;
        return timesHit;
    }

    function isSunk() {
        if (timesHit >= shipLength && timesHit !== 0) shipSunk = true;
        return shipSunk;
    }

    function setShipPos(tip, end) { // expect this format [x,y], [x,y]
        shipPosition = [tip, end]; // [[x,y], [x,y]]
        return shipPosition;
    }

    function getShipPos(){
        return shipPosition;
    }

    return { shipLength, timesHit, shipSunk, hit, isSunk, setShipPos };
}

function gameboard() {

}


