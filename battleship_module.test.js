import { ship, gameboard, player } from "./battleship_module.js";


test("ship hit returns 1", () => {
    const newShip = ship();
    expect(newShip.hit()).toBe(1);
});

test("ship status returns false", () => {
    const newShip = ship();
    expect(newShip.isSunk()).toBe(false);
});

test("ship position return [[5,2],[5,4]]", () => {
    const newShip = ship();
    expect(newShip.setShipPos([5, 2], [5, 4])).toEqual([[5, 2], [5, 4]]);
});

test("ship space coordinates return [1,2],[1,3],[1,4]", () => {
    const newShip = ship();
    newShip.setShipPos([1, 2], [1, 4]);
    expect(newShip.getShipSpaceCoordinates()).toEqual([[1, 2], [1, 3], [1, 4]]);
});

test("ship position throw error above range", () => {
    const newShip = ship();
    expect(() => {
        (newShip.setShipPos([11, 2], [3, 2])); npx
    }).toThrow("invalid coordinates : out of map range");
});

test("ship position throw error below range", () => {
    const newShip = ship();
    expect(() => {
        (newShip.setShipPos([10, 2], [10, -4])); npx
    }).toThrow();
});

test("ship position throw error diagonal coordinates", () => {
    const newShip = ship();
    expect(() => {
        (newShip.setShipPos([1, 2], [3, 4]));
    }).toThrow("invalid coordinates : diagonal");
});


test("ship length return 3", () => {
    const newShip = ship();
    newShip.setShipPos([3, 2], [3, 4]);
    newShip.calcShipLength();
    expect(newShip.getShipLength()).toBe(3);
});

test("ship length return 5", () => {
    const newShip = ship();
    newShip.setShipPos([5, 2], [1, 2]);
    newShip.calcShipLength();
    expect(newShip.getShipLength()).toBe(5);
});

test("create ship and that throws collision error", () => {
    const board = gameboard();
    board.createShip([3, 3], [3, 5]);
    expect(() => {
        board.createShip([3, 4], [3, 6]);
    }).toThrow("ship space already taken by another ship")
});

test("2 ships added to ship list with no collisions, total length/space taken is 6 units", () => {
    const board = gameboard();
    board.createShip([3, 3], [3, 5]);
    board.createShip([4, 4], [4, 6]);
    // console.log(board.getShipList());
    expect(board.getShipList()[0].getShipLength() + board.getShipList()[1].getShipLength()).toEqual(6);
});

test("throwing attack missed error for attack on existing missed area", () => {
    const board = gameboard();
    board.createShip([3, 3], [3, 5], "cruiser");
    board.createShip([4, 4], [4, 6], "battleship");
    board.recieveAttack([6, 1]);
    expect(() => {
        (board.recieveAttack([6, 1]));
    }).toThrow("space has already been attacked : missed");
});

test("throwing attack hit error for attack on existing hit area", () => {
    const board = gameboard();
    board.createShip([3, 3], [3, 5], "cruiser");
    board.createShip([4, 4], [4, 6], "battleship");
    board.recieveAttack([4, 5]);
    expect(() => {
        (board.recieveAttack([4, 5]));
    }).toThrow("space has already been attacked : hit");
});

test("ship hit and returned true", () => {
    const board = gameboard();
    board.createShip([3, 3], [3, 5], "cruiser");
    board.createShip([4, 4], [4, 6], "battleship");
    expect(board.recieveAttack([3, 4])).toBe(true);
});

test("ship not hit and returned false", () => {
    const board = gameboard();
    board.createShip([3, 3], [3, 5], "cruiser");
    board.createShip([4, 4], [4, 6], "battleship");
    expect(board.recieveAttack([7, 4])).toBe(false);
});

test("ship hit 3 times, sunk and returned true", () => {
    const board = gameboard();
    board.createShip([3, 3], [3, 5], "cruiser");
    board.createShip([4, 4], [4, 6], "battleship");
    board.recieveAttack([3, 3]);
    board.recieveAttack([3, 4]);
    board.recieveAttack([3, 5]);
    expect(board.getShipList()[0].isSunk()).toBe(true); //check if the first ship in the ship list is sunk or not
});

test("ship only hit 2 times, sunk and returned false", () => {
    const board = gameboard();
    board.createShip([3, 3], [3, 5], "cruiser");
    board.createShip([4, 4], [4, 6], "battleship");
    board.recieveAttack([3, 3]);
    board.recieveAttack([3, 4]);
    // board.recieveAttack([3, 5]);
    expect(board.getShipList()[0].isSunk()).toBe(false);
});

test("only ship 1 sunk, ship 2 is not sunk, return false", () => {
    const board = gameboard();
    board.createShip([3, 3], [3, 5], "cruiser");
    board.createShip([4, 4], [4, 6], "battleship");
    board.recieveAttack([3, 3]);
    board.recieveAttack([3, 4]);
    board.recieveAttack([3, 5]);
    expect(board.checkAllShipSunk()).toBe(false);
});

test("both ships sunk, return true", () => {
    const board = gameboard();
    board.createShip([3, 3], [3, 5], "cruiser");
    board.createShip([4, 4], [4, 6], "battleship");
    board.recieveAttack([3, 3]);
    board.recieveAttack([3, 4]);
    board.recieveAttack([3, 5]);
    board.recieveAttack([4, 4]);
    board.recieveAttack([4, 5]);
    board.recieveAttack([4, 6]);
    expect(board.checkAllShipSunk()).toBe(true);
});


test("test process through player function", () => {
    const player1 = player();
    player1.useBoard().createShip([3, 3], [3, 5], "cruiser");
    player1.useBoard().createShip([4, 4], [4, 6], "battleship");
    player1.useBoard().recieveAttack([3, 3]);
    player1.useBoard().recieveAttack([3, 4]);
    player1.useBoard().recieveAttack([3, 5]);
    player1.useBoard().recieveAttack([4, 4]);
    player1.useBoard().recieveAttack([4, 5]);
    player1.useBoard().recieveAttack([4, 6]);
    expect(player1.useBoard().checkAllShipSunk()).toBe(true);
});

// test("'Hello, World!' with an offset of 3 with the cipher will be 'Khoor, Zruog!'", () => {
//     expect(caesarCipher('Hello, World!', 3)).toBe('Khoor, Zruog!');
// });