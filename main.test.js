import { ship } from "./main.js";


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



// test("'Hello, World!' with an offset of 3 with the cipher will be 'Khoor, Zruog!'", () => {
//     expect(caesarCipher('Hello, World!', 3)).toBe('Khoor, Zruog!');
// });